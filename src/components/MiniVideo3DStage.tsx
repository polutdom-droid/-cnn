import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import { VideoScene, VideoVisualKind } from '../data/keyPointMedia';
import { CnnSlide } from '../types/slide';
import { MathFormula } from './MathFormula';

interface MiniVideo3DStageProps {
  kind: VideoVisualKind;
  slide: CnnSlide;
  scene: VideoScene;
  sceneElapsed: number;
  sceneDuration: number;
  isPlaying: boolean;
  isWaitingForAudio?: boolean;
}

// Pre-allocated scratch helpers (zero GC inside animation loop)
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _vecC = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _colorTmp = new THREE.Color();

function createProceduralImageTexture(accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0b1424';
    ctx.fillRect(0, 0, 256, 256);

    // Architectural grid & synthetic feature signal map
    const cols = 8;
    const cell = 256 / cols;
    for (let r = 0; r < cols; r++) {
      for (let c = 0; c < cols; c++) {
        const wave = Math.sin(r * 0.75 + c * 0.65) * 0.5 + 0.5;
        ctx.fillStyle =
          (r + c) % 3 === 0
            ? accentHex
            : `rgba(56, 189, 248, ${(0.12 + wave * 0.42).toFixed(2)})`;
        ctx.fillRect(c * cell + 3, r * cell + 3, cell - 6, cell - 6);
      }
    }
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.28)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 252);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 126);
    grad.addColorStop(0, 'rgba(2, 6, 18, 0.85)');
    grad.addColorStop(0.55, 'rgba(2, 6, 18, 0.35)');
    grad.addColorStop(1, 'rgba(2, 6, 18, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStudioGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#09111f';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.lineWidth = 1.5;
    const step = 32;
    for (let i = 0; i <= 512; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(2, 2, 508, 508);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function alignBeamBetween(
  mesh: THREE.Mesh,
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number
): void {
  _vecA.set(startX, startY, startZ);
  _vecB.set(endX, endY, endZ);
  _vecC.subVectors(_vecB, _vecA);
  const len = _vecC.length();
  mesh.position.copy(_vecA).addScaledVector(_vecC, 0.5);
  mesh.scale.set(1, Math.max(0.001, len), 1);
  if (len > 0.0001) {
    _vecC.normalize();
    _quat.setFromUnitVectors(_up, _vecC);
    mesh.quaternion.copy(_quat);
  }
}

export const MiniVideo3DStage: React.FC<MiniVideo3DStageProps> = ({
  kind,
  slide,
  scene: videoScene,
  sceneElapsed,
  sceneDuration,
  isPlaying,
  isWaitingForAudio = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const resetCameraFnRef = useRef<(() => void) | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const liveStateRef = useRef({
    kind,
    sceneElapsed,
    sceneDuration,
    isPlaying,
    isWaitingForAudio,
    slideId: slide.id,
  });
  liveStateRef.current = {
    kind,
    sceneElapsed,
    sceneDuration,
    isPlaying,
    isWaitingForAudio,
    slideId: slide.id,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 220);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b16);
    scene.fog = new THREE.FogExp2(0x060b16, 0.032);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    const defaultCamPos = new THREE.Vector3(0, 3.85, 8.6);
    const defaultTarget = new THREE.Vector3(0, 0.45, 0);
    camera.position.copy(defaultCamPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(defaultTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4.2;
    controls.maxDistance = 15;
    controls.minPolarAngle = Math.PI * 0.14;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.update();

    let userInteracted = false;
    let resettingCam = false;
    const onControlStart = () => {
      userInteracted = true;
      resettingCam = false;
      setHasInteracted(true);
    };
    controls.addEventListener('start', onControlStart);

    resetCameraFnRef.current = () => {
      userInteracted = false;
      resettingCam = true;
      setHasInteracted(false);
    };

    // Studio 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.65);
    keyLight.position.set(5.5, 9.5, 6.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 26;
    keyLight.shadow.camera.left = -6.5;
    keyLight.shadow.camera.right = 6.5;
    keyLight.shadow.camera.top = 6.5;
    keyLight.shadow.camera.bottom = -6.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.85);
    rimLight.position.set(-6, 4.5, -5.5);
    scene.add(rimLight);

    const accentPoint = new THREE.PointLight(0x10b981, 1.4, 14, 1.8);
    accentPoint.position.set(2.8, 2.2, 2.5);
    scene.add(accentPoint);

    // Track disposable resources cleanly
    const disposables: Array<{ dispose: () => void }> = [envRT];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const floorTex = createStudioGridTexture();
    floorTex.anisotropy = maxAniso;
    disposables.push(floorTex);

    const shadowTex = createContactShadowTexture();
    disposables.push(shadowTex);

    const rgbTexR = createProceduralImageTexture('rgba(244, 63, 94, 0.62)');
    const rgbTexG = createProceduralImageTexture('rgba(16, 185, 129, 0.62)');
    const rgbTexB = createProceduralImageTexture('rgba(56, 189, 248, 0.65)');
    [rgbTexR, rgbTexG, rgbTexB].forEach((t) => {
      t.anisotropy = maxAniso;
      disposables.push(t);
    });

    // Ground studio floor + soft contact shadow + architectural pedestal
    const floorGeo = new THREE.CircleGeometry(14, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.72,
      metalness: 0.25,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.82;
    floor.receiveShadow = true;
    scene.add(floor);
    disposables.push(floorGeo, floorMat);

    const contactGeo = new THREE.PlaneGeometry(9.6, 5.2);
    const contactMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    const contactPlane = new THREE.Mesh(contactGeo, contactMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -0.80;
    scene.add(contactPlane);
    disposables.push(contactGeo, contactMat);

    // Shared PBR Material Library (varied roughness >= 0.25 & metalness between parts)
    const matTitanium = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.34,
      metalness: 0.85,
    });
    const matAluminum = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.26,
      metalness: 0.9,
    });
    const matCopper = new THREE.MeshStandardMaterial({
      color: 0xe06c4f,
      roughness: 0.22,
      metalness: 0.88,
      emissive: 0x7c2d12,
      emissiveIntensity: 0.35,
    });
    const matCeramicSlate = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.62,
      metalness: 0.12,
    });
    const matPadSteel = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.55,
      metalness: 0.45,
    });
    const matEmeraldActive = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.24,
      metalness: 0.35,
      emissive: 0x059669,
      emissiveIntensity: 0.55,
    });
    const matAmberGlow = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.45,
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
    });
    const matCyanGlass = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.72,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.92,
      ior: 1.52,
      thickness: 0.4,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const matCopperGlass = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      roughness: 0.14,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.68,
      transparent: true,
      opacity: isSoftwareGl ? 0.38 : 0.9,
      ior: 1.55,
      thickness: 0.35,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const matLaserBeam = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.78,
    });
    const matCyanBeam = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.82,
    });

    disposables.push(
      matTitanium,
      matAluminum,
      matCopper,
      matCeramicSlate,
      matPadSteel,
      matEmeraldActive,
      matAmberGlow,
      matCyanGlass,
      matCopperGlass,
      matLaserBeam,
      matCyanBeam
    );

    // Shared Geometries
    const boxBezelGeo = new THREE.BoxGeometry(0.46, 0.22, 0.46);
    const tileSmallGeo = new THREE.BoxGeometry(0.42, 0.16, 0.42);
    const railGeo = new THREE.CylinderGeometry(0.045, 0.045, 4.6, 16);
    const sphereNodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const beamGeo = new THREE.CylinderGeometry(0.018, 0.018, 1, 10);
    disposables.push(boxBezelGeo, tileSmallGeo, railGeo, sphereNodeGeo, beamGeo);

    // =========================================================
    // 1. OVERVIEW GROUP: 3D End-to-End CNN Tensor Pipeline Rig
    // =========================================================
    const overviewGroup = new THREE.Group();
    scene.add(overviewGroup);

    // Optical bench rail + mounting feet (3-part base)
    const benchBarGeo = new THREE.BoxGeometry(7.2, 0.14, 0.55);
    const benchBar = new THREE.Mesh(benchBarGeo, matTitanium);
    benchBar.position.set(0, -0.68, 0);
    benchBar.castShadow = true;
    benchBar.receiveShadow = true;
    overviewGroup.add(benchBar);
    disposables.push(benchBarGeo);

    const legGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.16, 16);
    disposables.push(legGeo);
    [-2.8, 0, 2.8].forEach((lx) => {
      const leg = new THREE.Mesh(legGeo, matAluminum);
      leg.position.set(lx, -0.74, 0);
      overviewGroup.add(leg);
    });

    // Stage A: RGB 3-Channel Tensor Volume (3 textured plates + aluminum corner pins)
    const rgbGroup = new THREE.Group();
    rgbGroup.position.set(-2.55, 0.42, 0);
    overviewGroup.add(rgbGroup);
    const plateGeo = new THREE.BoxGeometry(1.25, 1.25, 0.07);
    const collarGeo = new THREE.BoxGeometry(1.36, 1.36, 0.04);
    disposables.push(plateGeo, collarGeo);
    const rgbTextures = [rgbTexR, rgbTexG, rgbTexB];
    rgbTextures.forEach((tex, idx) => {
      const mPlate = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.32,
        metalness: 0.18,
      });
      disposables.push(mPlate);
      const plate = new THREE.Mesh(plateGeo, mPlate);
      plate.position.z = (idx - 1) * 0.24;
      plate.castShadow = true;
      rgbGroup.add(plate);
    });
    const rgbPedestalGeo = new THREE.BoxGeometry(0.95, 0.42, 0.85);
    const rgbPedestal = new THREE.Mesh(rgbPedestalGeo, matTitanium);
    rgbPedestal.position.set(0, -0.84, 0);
    rgbGroup.add(rgbPedestal);
    disposables.push(rgbPedestalGeo);

    // Stage B: Conv 3x3 Feature Map Stack (4 volumetric glass-copper slabs)
    const convStackGroup = new THREE.Group();
    convStackGroup.position.set(-0.75, 0.42, 0);
    overviewGroup.add(convStackGroup);
    const fmapGeo = new THREE.BoxGeometry(0.98, 0.98, 0.1);
    disposables.push(fmapGeo);
    const convSlabs: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const matSlab = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x0ea5e9 : 0x38bdf8,
        roughness: 0.25,
        metalness: 0.45,
        emissive: 0x0369a1,
        emissiveIntensity: 0.35,
      });
      disposables.push(matSlab);
      const slab = new THREE.Mesh(fmapGeo, matSlab);
      slab.position.z = (i - 1.5) * 0.22;
      slab.castShadow = true;
      convStackGroup.add(slab);
      convSlabs.push(slab);
    }
    const convFrame = new THREE.Mesh(collarGeo, matCopper);
    convFrame.scale.set(0.78, 0.78, 0.9);
    convFrame.position.z = -0.45;
    convStackGroup.add(convFrame);

    // Stage C: ReLU + MaxPool Compact Pyramid Assembly
    const poolStageGroup = new THREE.Group();
    poolStageGroup.position.set(0.95, 0.38, 0);
    overviewGroup.add(poolStageGroup);
    const poolSlabGeo = new THREE.BoxGeometry(0.68, 0.68, 0.11);
    disposables.push(poolSlabGeo);
    for (let i = 0; i < 4; i++) {
      const slab = new THREE.Mesh(poolSlabGeo, i === 3 ? matEmeraldActive : matCeramicSlate);
      slab.position.z = (i - 1.5) * 0.2;
      slab.castShadow = true;
      poolStageGroup.add(slab);
    }

    // Stage D: Dense Classifier Tower (5 3D Logit Bars inside glass casing)
    const fcGroup = new THREE.Group();
    fcGroup.position.set(2.55, 0.35, 0);
    overviewGroup.add(fcGroup);
    const fcCaseGeo = new THREE.BoxGeometry(1.15, 1.25, 0.72);
    const fcCase = new THREE.Mesh(fcCaseGeo, matCyanGlass);
    fcGroup.add(fcCase);
    disposables.push(fcCaseGeo);

    const barGeo = new THREE.BoxGeometry(0.14, 0.9, 0.24);
    disposables.push(barGeo);
    const logitBars: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(barGeo, i === 2 ? matEmeraldActive : matAluminum);
      bar.position.set((i - 2) * 0.2, -0.1, 0);
      bar.castShadow = true;
      fcGroup.add(bar);
      logitBars.push(bar);
    }

    // Glowing optical fiber bus connecting stages + travelling photon spheres
    const conduitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.55, -0.32, 0.35),
      new THREE.Vector3(-0.75, -0.22, 0.35),
      new THREE.Vector3(0.95, -0.26, 0.35),
      new THREE.Vector3(2.55, -0.32, 0.35),
    ]);
    const tubeGeo = new THREE.TubeGeometry(conduitCurve, 40, 0.032, 10, false);
    const conduitMesh = new THREE.Mesh(tubeGeo, matCyanBeam);
    overviewGroup.add(conduitMesh);
    disposables.push(tubeGeo);

    const photonMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(sphereNodeGeo, matAmberGlow);
      overviewGroup.add(p);
      photonMeshes.push(p);
    }

    // =========================================================
    // 2. CONVOLUTION GROUP: 3D Sliding Kernel & Feature Map
    // =========================================================
    const convGroup = new THREE.Group();
    scene.add(convGroup);

    // Input 5x5 Base Chassis (multi-part)
    const inputChassisGeo = new THREE.BoxGeometry(3.05, 0.24, 3.05);
    const inputChassis = new THREE.Mesh(inputChassisGeo, matTitanium);
    inputChassis.position.set(-1.9, -0.62, 0);
    inputChassis.receiveShadow = true;
    inputChassis.castShadow = true;
    convGroup.add(inputChassis);
    disposables.push(inputChassisGeo);

    const inputTiles: THREE.Mesh[] = [];
    const inputTileMats: THREE.MeshStandardMaterial[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const m = new THREE.MeshStandardMaterial({
          color: 0x1e3a5f,
          roughness: 0.48,
          metalness: 0.25,
        });
        disposables.push(m);
        inputTileMats.push(m);
        const tile = new THREE.Mesh(tileSmallGeo, m);
        tile.position.set(-1.9 + (c - 2) * 0.52, -0.44, (r - 2) * 0.52);
        tile.castShadow = true;
        tile.receiveShadow = true;
        convGroup.add(tile);
        inputTiles.push(tile);
      }
    }

    // Floating 3x3 Optical Kernel Scanner Head (Composite 5-part assembly)
    const scannerGroup = new THREE.Group();
    scannerGroup.position.set(-1.9, 0.38, 0);
    convGroup.add(scannerGroup);

    const scannerCrystalGeo = new THREE.BoxGeometry(1.5, 0.16, 1.5);
    const scannerCrystal = new THREE.Mesh(scannerCrystalGeo, matCopperGlass);
    scannerGroup.add(scannerCrystal);
    disposables.push(scannerCrystalGeo);

    // Copper bezel rails around 3x3 scanner
    const bezelBarXGeo = new THREE.BoxGeometry(1.62, 0.22, 0.08);
    const bezelBarZGeo = new THREE.BoxGeometry(0.08, 0.22, 1.62);
    disposables.push(bezelBarXGeo, bezelBarZGeo);
    [-0.78, 0.78].forEach((offset) => {
      const bx = new THREE.Mesh(bezelBarXGeo, matCopper);
      bx.position.z = offset;
      bx.castShadow = true;
      scannerGroup.add(bx);
      const bz = new THREE.Mesh(bezelBarZGeo, matCopper);
      bz.position.x = offset;
      bz.castShadow = true;
      scannerGroup.add(bz);
    });
    const scannerHubGeo = new THREE.CylinderGeometry(0.16, 0.24, 0.22, 18);
    const scannerHub = new THREE.Mesh(scannerHubGeo, matAluminum);
    scannerHub.position.y = 0.2;
    scannerGroup.add(scannerHub);
    disposables.push(scannerHubGeo);

    // Output 3x3 Elevated Feature Map Pedestal
    const outChassisGeo = new THREE.BoxGeometry(2.05, 0.24, 2.05);
    const outChassis = new THREE.Mesh(outChassisGeo, matTitanium);
    outChassis.position.set(2.05, -0.35, 0);
    outChassis.castShadow = true;
    outChassis.receiveShadow = true;
    convGroup.add(outChassis);
    disposables.push(outChassisGeo);

    const outTileGeo = new THREE.BoxGeometry(0.48, 0.2, 0.48);
    disposables.push(outTileGeo);
    const outTiles: THREE.Mesh[] = [];
    const outTileMats: THREE.MeshStandardMaterial[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const m = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.35,
          metalness: 0.35,
        });
        disposables.push(m);
        outTileMats.push(m);
        const tile = new THREE.Mesh(outTileGeo, m);
        tile.position.set(2.05 + (c - 1) * 0.58, -0.14, (r - 1) * 0.58);
        tile.castShadow = true;
        convGroup.add(tile);
        outTiles.push(tile);
      }
    }

    // Projection beam from Kernel Hub to active Feature Map cell
    const convBeam = new THREE.Mesh(beamGeo, matLaserBeam);
    convGroup.add(convBeam);
    const convPulseSphere = new THREE.Mesh(sphereNodeGeo, matAmberGlow);
    convGroup.add(convPulseSphere);

    // =========================================================
    // 3. PADDING & STRIDE GROUP: Zero-Pad Perimeter + S=2 Gantry
    // =========================================================
    const padGroup = new THREE.Group();
    scene.add(padGroup);

    const padChassisGeo = new THREE.BoxGeometry(3.2, 0.22, 3.2);
    const padChassis = new THREE.Mesh(padChassisGeo, matTitanium);
    padChassis.position.set(-1.35, -0.62, 0);
    padChassis.receiveShadow = true;
    padGroup.add(padChassis);
    disposables.push(padChassisGeo);

    const padTiles: THREE.Mesh[] = [];
    const padTileMats: THREE.MeshStandardMaterial[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
        const m = new THREE.MeshStandardMaterial({
          color: isBorder ? 0x475569 : 0x0284c7,
          roughness: isBorder ? 0.58 : 0.28,
          metalness: isBorder ? 0.65 : 0.35,
        });
        disposables.push(m);
        padTileMats.push(m);
        const tile = new THREE.Mesh(tileSmallGeo, m);
        tile.scale.y = isBorder ? 0.72 : 1.35;
        tile.position.set(-1.35 + (c - 2) * 0.54, isBorder ? -0.45 : -0.4, (r - 2) * 0.54);
        tile.castShadow = true;
        padGroup.add(tile);
        padTiles.push(tile);
      }
    }

    const padScanner = new THREE.Mesh(
      new THREE.BoxGeometry(1.58, 0.24, 1.58),
      matCyanGlass
    );
    padScanner.position.set(-1.35, 0.25, 0);
    padGroup.add(padScanner);
    disposables.push(padScanner.geometry);

    // 2x2 Output Stride Result
    const strideOutBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.24, 1.55),
      matTitanium
    );
    strideOutBase.position.set(2.0, -0.35, 0);
    padGroup.add(strideOutBase);
    disposables.push(strideOutBase.geometry);

    const strideOutTiles: THREE.Mesh[] = [];
    const strideOutMats: THREE.MeshStandardMaterial[] = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.4,
      });
      disposables.push(m);
      strideOutMats.push(m);
      const t = new THREE.Mesh(outTileGeo, m);
      const rr = Math.floor(i / 2);
      const cc = i % 2;
      t.position.set(2.0 + (cc - 0.5) * 0.62, -0.14, (rr - 0.5) * 0.62);
      padGroup.add(t);
      strideOutTiles.push(t);
    }
    const padBeam = new THREE.Mesh(beamGeo, matCyanBeam);
    padGroup.add(padBeam);

    // =========================================================
    // 4. POOLING GROUP: 3D Heightfield Columns + Winning Elevator
    // =========================================================
    const poolGroup = new THREE.Group();
    scene.add(poolGroup);

    const poolBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.75, 0.22, 2.75),
      matTitanium
    );
    poolBase.position.set(-1.65, -0.62, 0);
    poolBase.receiveShadow = true;
    poolGroup.add(poolBase);
    disposables.push(poolBase.geometry);

    const poolValues = [
      1, 2, 4, 6,
      5, 6, 7, 8,
      3, 2, 1, 0,
      1, 2, 3, 4,
    ];
    const poolMaxVals = [6, 8, 3, 4];
    const poolColGeo = new THREE.BoxGeometry(0.42, 1, 0.42);
    disposables.push(poolColGeo);

    const poolCols: Array<{ mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; q: number; val: number }> = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = poolValues[r * 4 + c];
        const q = Math.floor(r / 2) * 2 + Math.floor(c / 2);
        const h = Math.max(0.14, val * 0.18 + 0.14);
        const m = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.36,
          metalness: 0.4,
        });
        disposables.push(m);
        const col = new THREE.Mesh(poolColGeo, m);
        col.scale.y = h;
        col.position.set(-1.65 + (c - 1.5) * 0.56, -0.51 + h * 0.5, (r - 1.5) * 0.56);
        col.castShadow = true;
        poolGroup.add(col);
        poolCols.push({ mesh: col, mat: m, q, val });
      }
    }

    // 2x2 Quadrant optical frame
    const quadFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.08, 1.16),
      matCyanGlass
    );
    quadFrame.position.set(-1.65, 1.18, 0);
    poolGroup.add(quadFrame);
    disposables.push(quadFrame.geometry);

    // Downsampled 2x2 Output Columns
    const poolOutBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.22, 1.75),
      matTitanium
    );
    poolOutBase.position.set(1.95, -0.62, 0);
    poolOutBase.receiveShadow = true;
    poolGroup.add(poolOutBase);
    disposables.push(poolOutBase.geometry);

    const poolOutCols: Array<{ mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; targetH: number }> = [];
    for (let i = 0; i < 4; i++) {
      const rr = Math.floor(i / 2);
      const cc = i % 2;
      const targetH = poolMaxVals[i] * 0.18 + 0.18;
      const m = new THREE.MeshStandardMaterial({
        color: 0x059669,
        roughness: 0.24,
        metalness: 0.42,
      });
      disposables.push(m);
      const col = new THREE.Mesh(poolColGeo, m);
      col.scale.set(1.25, targetH, 1.25);
      col.position.set(1.95 + (cc - 0.5) * 0.68, -0.51 + targetH * 0.5, (rr - 0.5) * 0.68);
      col.castShadow = true;
      poolGroup.add(col);
      poolOutCols.push({ mesh: col, mat: m, targetH });
    }
    const poolBeam = new THREE.Mesh(beamGeo, matCyanBeam);
    poolGroup.add(poolBeam);

    // =========================================================
    // 5. ARCHITECTURE / FORMULA GROUP: Holographic Core Assembly
    // =========================================================
    const archGroup = new THREE.Group();
    scene.add(archGroup);

    const archPillarGeo = new THREE.BoxGeometry(1.38, 1.45, 0.72);
    const archBaseGeo = new THREE.BoxGeometry(1.52, 0.2, 0.92);
    disposables.push(archPillarGeo, archBaseGeo);

    const archModules: THREE.Group[] = [];
    const archGlassMeshes: THREE.Mesh[] = [];
    [-2.4, 0, 2.4].forEach((px, idx) => {
      const mod = new THREE.Group();
      mod.position.set(px, 0.1, 0);
      const base = new THREE.Mesh(archBaseGeo, matTitanium);
      base.position.y = -0.78;
      base.castShadow = true;
      mod.add(base);

      const core = new THREE.Mesh(
        new THREE.BoxGeometry(1.02, 1.05, 0.42),
        idx === 1 ? matCopper : matCeramicSlate
      );
      core.position.y = -0.1;
      core.castShadow = true;
      mod.add(core);
      disposables.push(core.geometry);

      const shell = new THREE.Mesh(archPillarGeo, matCyanGlass);
      shell.position.y = -0.05;
      mod.add(shell);
      archGlassMeshes.push(shell);

      archGroup.add(mod);
      archModules.push(mod);
    });

    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 0.75, 0),
      new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(2.4, 0.75, 0),
    ]);
    const archTubeGeo = new THREE.TubeGeometry(archCurve, 36, 0.035, 10, false);
    const archTube = new THREE.Mesh(archTubeGeo, matCyanBeam);
    archGroup.add(archTube);
    disposables.push(archTubeGeo);

    const archPhotons: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(sphereNodeGeo, matAmberGlow);
      archGroup.add(p);
      archPhotons.push(p);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Damped continuous state variables
    let scanX = -1.9 - 0.52;
    let scanZ = -0.52;
    let padScanX = -1.35 - 0.54;
    let padScanZ = -0.54;
    let quadX = -1.65 - 0.56;
    let quadZ = -0.56;

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      const {
        kind: curKind,
        sceneElapsed: elapsed,
        sceneDuration: duration,
        isPlaying: playing,
        isWaitingForAudio: waiting,
      } = liveStateRef.current;

      const active = playing && !waiting;
      const progress = Math.max(0, Math.min(0.9999, elapsed / Math.max(1, duration)));

      // Toggle visible 3D assembly cleanly per scene visualKind
      overviewGroup.visible = curKind === 'overview';
      convGroup.visible = curKind === 'convolution';
      padGroup.visible = curKind === 'padding-stride';
      poolGroup.visible = curKind === 'pooling';
      archGroup.visible = curKind === 'architecture' || curKind === 'formula';

      // Subtle living studio drift when user isn't manually orbiting
      if (resettingCam) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, defaultCamPos.x, 6, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, defaultCamPos.y, 6, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, defaultCamPos.z, 6, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, defaultTarget.x, 6, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, defaultTarget.y, 6, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, defaultTarget.z, 6, dt);
        if (camera.position.distanceTo(defaultCamPos) < 0.03) {
          resettingCam = false;
        }
      } else if (!userInteracted) {
        const driftAngle = Math.sin((active ? elapsed : t * 0.4) * 0.32) * 0.24;
        const targetCamX = Math.sin(driftAngle) * 2.1;
        const targetCamY = 3.85 + Math.cos((active ? elapsed : t * 0.4) * 0.28) * 0.26;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 2.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 2.5, dt);
      }

      if (curKind === 'overview') {
        // Highlight & animate stages progressively in sync with scene timeline (0% -> 100%)
        rgbGroup.rotation.y = Math.sin(elapsed * 0.85) * 0.16;
        convSlabs.forEach((s, idx) => {
          const waveOffset = progress * 4 - idx;
          const lift = waveOffset >= 0 && waveOffset < 1 ? 0.14 : 0;
          s.position.y = THREE.MathUtils.damp(
            s.position.y,
            lift + Math.sin(elapsed * 1.8 + idx * 0.7) * 0.05,
            8,
            dt
          );
        });
        logitBars.forEach((b, idx) => {
          const level = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(elapsed * 2.1 + idx * 1.1));
          b.scale.y = THREE.MathUtils.damp(b.scale.y, level, 8, dt);
          b.position.y = -0.55 + b.scale.y * 0.45;
        });
        photonMeshes.forEach((p, idx) => {
          const u = (elapsed * 0.35 + idx * 0.25) % 1;
          conduitCurve.getPointAt(u, _vecA);
          p.position.copy(_vecA);
        });
      } else if (curKind === 'convolution') {
        // Scan all 9 3x3 positions smoothly from 0% to 100% of the scene narration
        const pos = Math.min(8, Math.floor(progress * 9));
        const winR = Math.floor(pos / 3);
        const winC = pos % 3;
        const targetX = -1.9 + (winC - 1) * 0.52;
        const targetZ = (winR - 1) * 0.52;

        scanX = THREE.MathUtils.damp(scanX, targetX, 9, dt);
        scanZ = THREE.MathUtils.damp(scanZ, targetZ, 9, dt);
        scannerGroup.position.set(scanX, 0.36 + Math.sin(elapsed * 2.4) * 0.03, scanZ);

        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const idx = r * 5 + c;
            const inWin = r >= winR && r < winR + 3 && c >= winC && c < winC + 3;
            const tile = inputTiles[idx];
            const mat = inputTileMats[idx];
            const targetH = inWin ? 1.45 : 0.9;
            tile.scale.y = THREE.MathUtils.damp(tile.scale.y, targetH, 10, dt);
            _colorTmp.setHex(inWin ? 0xf97316 : 0x1e3a5f);
            mat.color.lerp(_colorTmp, 0.18);
            mat.emissive.setHex(inWin ? 0x9a3412 : 0x000000);
            mat.emissiveIntensity = inWin ? 0.55 : 0;
          }
        }

        const outTargetX = 2.05 + (winC - 1) * 0.58;
        const outTargetZ = (winR - 1) * 0.58;
        for (let i = 0; i < 9; i++) {
          const activeTile = i === pos;
          const done = i < pos;
          const tile = outTiles[i];
          const mat = outTileMats[i];
          const targetH = activeTile ? 1.85 : done ? 1.25 : 0.65;
          tile.scale.y = THREE.MathUtils.damp(tile.scale.y, targetH, 10, dt);
          tile.position.y = -0.22 + tile.scale.y * 0.1;
          _colorTmp.setHex(activeTile ? 0xe06c4f : done ? 0x10b981 : 0x1e293b);
          mat.color.lerp(_colorTmp, 0.18);
          mat.emissive.setHex(activeTile ? 0xc2410c : done ? 0x047857 : 0x000000);
          mat.emissiveIntensity = activeTile ? 0.75 : done ? 0.35 : 0;
        }

        alignBeamBetween(convBeam, scanX, 0.58, scanZ, outTargetX, 0.02, outTargetZ);
        const pulseU = ((progress * 9) % 1);
        convPulseSphere.position.set(
          THREE.MathUtils.lerp(scanX, outTargetX, pulseU),
          THREE.MathUtils.lerp(0.58, 0.02, pulseU) + Math.sin(pulseU * Math.PI) * 0.45,
          THREE.MathUtils.lerp(scanZ, outTargetZ, pulseU)
        );
      } else if (curKind === 'padding-stride') {
        const pos = Math.min(3, Math.floor(progress * 4));
        const rr = Math.floor(pos / 2);
        const cc = pos % 2;
        const targetX = -1.35 + (cc === 0 ? -0.54 : 0.54);
        const targetZ = rr === 0 ? -0.54 : 0.54;
        padScanX = THREE.MathUtils.damp(padScanX, targetX, 8, dt);
        padScanZ = THREE.MathUtils.damp(padScanZ, targetZ, 8, dt);
        padScanner.position.set(padScanX, 0.25 + Math.sin(elapsed * 2.2) * 0.03, padScanZ);

        const wr = rr * 2;
        const wc = cc * 2;
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const idx = r * 5 + c;
            const inWin = r >= wr && r < wr + 3 && c >= wc && c < wc + 3;
            const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
            const mat = padTileMats[idx];
            _colorTmp.setHex(inWin ? 0x38bdf8 : isBorder ? 0x475569 : 0x0369a1);
            mat.color.lerp(_colorTmp, 0.16);
            mat.emissive.setHex(inWin ? 0x0284c7 : 0x000000);
            mat.emissiveIntensity = inWin ? 0.55 : 0;
          }
        }

        const outX = 2.0 + (cc - 0.5) * 0.62;
        const outZ = (rr - 0.5) * 0.62;
        strideOutTiles.forEach((tile, i) => {
          const activeTile = i === pos;
          const done = i < pos;
          const mat = strideOutMats[i];
          tile.scale.y = THREE.MathUtils.damp(tile.scale.y, activeTile ? 1.8 : done ? 1.2 : 0.7, 9, dt);
          _colorTmp.setHex(activeTile ? 0x38bdf8 : done ? 0x10b981 : 0x1e293b);
          mat.color.lerp(_colorTmp, 0.18);
          mat.emissive.setHex(activeTile ? 0x0284c7 : done ? 0x047857 : 0x000000);
          mat.emissiveIntensity = activeTile ? 0.65 : done ? 0.35 : 0;
        });
        alignBeamBetween(padBeam, padScanX, 0.38, padScanZ, outX, 0.02, outZ);
      } else if (curKind === 'pooling') {
        const activeQ = Math.min(3, Math.floor(progress * 4));
        const qRow = Math.floor(activeQ / 2);
        const qCol = activeQ % 2;
        const targetQX = -1.65 + (qCol === 0 ? -0.56 : 0.56);
        const targetQZ = qRow === 0 ? -0.56 : 0.56;
        quadX = THREE.MathUtils.damp(quadX, targetQX, 8, dt);
        quadZ = THREE.MathUtils.damp(quadZ, targetQZ, 8, dt);
        quadFrame.position.set(quadX, 1.18 + Math.sin(elapsed * 2) * 0.03, quadZ);

        poolCols.forEach((item) => {
          const inQuad = item.q === activeQ;
          const isWinner = inQuad && item.val === poolMaxVals[activeQ];
          _colorTmp.setHex(isWinner ? 0x10b981 : inQuad ? 0x38bdf8 : 0x334155);
          item.mat.color.lerp(_colorTmp, 0.18);
          item.mat.emissive.setHex(isWinner ? 0x059669 : inQuad ? 0x0369a1 : 0x000000);
          item.mat.emissiveIntensity = isWinner ? 0.75 : inQuad ? 0.3 : 0;
        });

        poolOutCols.forEach((outCol, idx) => {
          const activeCol = idx === activeQ;
          _colorTmp.setHex(activeCol ? 0x34d399 : 0x059669);
          outCol.mat.color.lerp(_colorTmp, 0.18);
          outCol.mat.emissive.setHex(activeCol ? 0x10b981 : 0x064e3b);
          outCol.mat.emissiveIntensity = activeCol ? 0.75 : 0.25;
        });

        const outColX = 1.95 + (qCol - 0.5) * 0.68;
        const outColZ = (qRow - 0.5) * 0.68;
        alignBeamBetween(poolBeam, quadX, 1.18, quadZ, outColX, 0.9, outColZ);
      } else {
        // 'architecture' & 'formula' holographic 3D backdrop rig
        const activeMod = Math.min(archModules.length - 1, Math.floor(progress * archModules.length));
        archModules.forEach((mod, idx) => {
          const targetY = idx === activeMod ? 0.34 : 0.08;
          mod.position.y = THREE.MathUtils.damp(mod.position.y, targetY, 6, dt);
          mod.rotation.y = Math.sin(elapsed * 0.65 + idx * 0.8) * (curKind === 'formula' ? 0.28 : 0.14);
        });
        archPhotons.forEach((p, idx) => {
          const u = (elapsed * 0.38 + idx * 0.33) % 1;
          archCurve.getPointAt(u, _vecA);
          p.position.copy(_vecA);
        });
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const nw = Math.max(container.clientWidth, 320);
      const nh = Math.max(container.clientHeight, 220);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#060b16] select-none overflow-hidden">
      {/* Dedicated WebGL Mount Container (sibling overlays sit outside) */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D CNN Concept Viewport"
      />

      {/* Crisp floating formula overlay for formula-focused scenes */}
      {kind === 'formula' && videoScene.highlightFormula && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="pointer-events-auto w-full max-w-xl rounded-xl border border-sky-400/45 bg-[#081224]/92 px-5 py-4 text-center shadow-2xl">
            <span className="block text-[11px] font-mono font-semibold text-sky-400 mb-2">
              Eq. ({slide.id}) · 3D Spatial Formula Projection
            </span>
            <div className="text-sky-100 overflow-x-auto">
              <MathFormula
                latex={videoScene.highlightFormula}
                displayMode
                className="text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      )}

      {/* Minimal Top-Left Spec & Interactive 3D Hint */}
      <div className="pointer-events-none absolute top-2.5 left-3 flex items-center gap-2">
        <span className="rounded-md border border-sky-500/35 bg-[#091224]/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-300">
          3D WebGL · Drag to Orbit / Scroll Zoom
        </span>
      </div>

      {/* Camera Reset button when user orbits away */}
      {hasInteracted && (
        <button
          type="button"
          onClick={() => resetCameraFnRef.current?.()}
          className="absolute top-2.5 right-3 flex items-center gap-1 rounded-md border border-slate-700 bg-[#091224]/95 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset 3D</span>
        </button>
      )}
    </div>
  );
};
