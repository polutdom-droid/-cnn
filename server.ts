import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

type VoiceLang = 'km' | 'en';

const ttsCache = new Map<string, Buffer>();
const inFlightTts = new Map<string, Promise<Buffer>>();
const MAX_TTS_CACHE_ENTRIES = 300;
const DISK_CACHE_DIR = path.join(os.tmpdir(), 'cnn-studio-tts-cache');

try {
  fs.mkdirSync(DISK_CACHE_DIR, { recursive: true });
} catch {
  // Ignore if tmpdir creation fails; RAM cache still operates
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getDiskCachePath(cacheKey: string): string {
  const hash = crypto.createHash('sha256').update(cacheKey).digest('hex');
  return path.join(DISK_CACHE_DIR, `${hash}.wav`);
}

function readCachedTts(cacheKey: string): Buffer | null {
  const mem = ttsCache.get(cacheKey);
  if (mem) return mem;

  try {
    const filePath = getDiskCachePath(cacheKey);
    if (fs.existsSync(filePath)) {
      const diskBuf = fs.readFileSync(filePath);
      if (diskBuf.length > 44) {
        setCachedTts(cacheKey, diskBuf, false);
        return diskBuf;
      }
    }
  } catch {
    // Ignore disk read issues
  }
  return null;
}

function setCachedTts(cacheKey: string, wavBuffer: Buffer, writeDisk = true): void {
  if (ttsCache.has(cacheKey)) {
    ttsCache.delete(cacheKey);
  } else if (ttsCache.size >= MAX_TTS_CACHE_ENTRIES) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey) ttsCache.delete(oldestKey);
  }
  ttsCache.set(cacheKey, wavBuffer);

  if (writeDisk) {
    try {
      fs.writeFileSync(getDiskCachePath(cacheKey), wavBuffer);
    } catch {
      // Non-fatal disk cache write failure
    }
  }
}

function ensureWavBuffer(rawBuffer: Buffer, mimeType?: string): Buffer {
  if (
    rawBuffer.length >= 12 &&
    rawBuffer.toString('ascii', 0, 4) === 'RIFF' &&
    rawBuffer.toString('ascii', 8, 12) === 'WAVE'
  ) {
    return rawBuffer;
  }

  let sampleRate = 24000;
  if (mimeType) {
    const rateMatch = /rate=(\d+)/i.exec(mimeType);
    if (rateMatch) {
      const parsed = Number(rateMatch[1]);
      if (Number.isFinite(parsed) && parsed >= 8000 && parsed <= 96000) {
        sampleRate = parsed;
      }
    }
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = rawBuffer.length;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, rawBuffer]);
}

function extractRateLimitInfo(err: unknown): { isRateLimit: boolean; retryAfterSec: number } {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  const status = (err as { status?: number })?.status;
  const isRateLimit =
    status === 429 ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.toLowerCase().includes('quota');

  if (!isRateLimit) {
    return { isRateLimit: false, retryAfterSec: 0 };
  }

  const retryMatch =
    /retry in\s+(\d+(?:\.\d+)?)s/i.exec(msg) ??
    /"retryDelay"\s*:\s*"(\d+)s"/i.exec(msg);
  const parsedSec = retryMatch ? Math.ceil(Number(retryMatch[1])) : 18;
  const retryAfterSec = Math.max(5, Math.min(60, Number.isFinite(parsedSec) ? parsedSec : 18));
  return { isRateLimit: true, retryAfterSec };
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/tts', async (req: Request, res: Response) => {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const rawLang = req.body?.voiceLang;
    const voiceLang: VoiceLang = rawLang === 'en' ? 'en' : 'km';

    if (!rawText) {
      res.status(400).json({ error: 'Text is required for speech synthesis.' });
      return;
    }

    const text = rawText.slice(0, 1200);
    const voiceName = 'Kore';
    const cacheKey = `${voiceLang}::${voiceName}::${text}`;

    const cached = readCachedTts(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.send(cached);
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    try {
      let pending = inFlightTts.get(cacheKey);
      if (!pending) {
        pending = (async () => {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [{ text }],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          });

          const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          const base64Audio = inlineData?.data;
          if (!base64Audio) {
            throw new Error('No audio stream was returned by the TTS model.');
          }

          const rawBuffer = Buffer.from(base64Audio, 'base64');
          const wavBuffer = ensureWavBuffer(rawBuffer, inlineData?.mimeType);
          setCachedTts(cacheKey, wavBuffer, true);
          return wavBuffer;
        })();
        inFlightTts.set(cacheKey, pending);
      }

      const wavBuffer = await pending;
      inFlightTts.delete(cacheKey);

      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.send(wavBuffer);
    } catch (err) {
      inFlightTts.delete(cacheKey);
      const { isRateLimit, retryAfterSec } = extractRateLimitInfo(err);
      if (isRateLimit) {
        console.warn(`[TTS Rate Limit]: Free tier RPM reached, retry in ${retryAfterSec}s.`);
        res.setHeader('Retry-After', String(retryAfterSec));
        res.status(429).json({
          error: `TTS rate limit reached. Retrying in ${retryAfterSec}s.`,
          rateLimited: true,
          retryAfterSec,
        });
        return;
      }

      console.warn('[TTS Warning]:', err instanceof Error ? err.message : err);
      const message =
        err instanceof Error ? err.message : 'Speech synthesis failed.';
      res.status(502).json({ error: message });
    }
  });

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
