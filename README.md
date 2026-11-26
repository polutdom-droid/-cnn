# CNN Interactive Blueprints & Studio (EN/KH)

Welcome to the **03 Convolutional Neural Networks (CNN)** Interactive Blueprints and Studio web application built with React, TypeScript, Tailwind CSS, Three.js (3D), and Gemini AI TTS.

## Project Structure

- `src/` - React frontend components, slides data, 3D visualization stages, KaTeX math formulas, export studio, and bilingual text.
- `server.ts` - Express backend server providing the `/api/tts` Gemini Text-to-Speech endpoint (using `gemini-3.8-flash-lite-tts`).
- `vercel.json` - Vercel deployment configuration.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deploying to Vercel

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Click **Deploy**. Vercel will automatically build both the React frontend and the Express backend API routes using `vercel.json`.
