import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { birthdayAudio } from '../utils/audioSynthesizer';
import { triggerRealisticConfetti, triggerFireworks } from '../utils/confettiFireworks';
import { activityTracker } from '../utils/activityTracker';
import { getPerformanceConfig } from '../utils/adminAuth';

interface ThreeBirthdaySceneProps {
  themeColor?: string;
  onAllCandlesBlownOut?: () => void;
  interactive?: boolean;
}

export const ThreeBirthdayScene: React.FC<ThreeBirthdaySceneProps> = ({
  themeColor = '#f472b6',
  onAllCandlesBlownOut,
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [isRotating, setIsRotating] = useState(true);
  const [messageToast, setMessageToast] = useState<string | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const candlesGroupRef = useRef<THREE.Group | null>(null);
  const flameMeshesRef = useRef<THREE.Mesh[]>([]);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);
  const smokeParticlesRef = useRef<THREE.Points[]>([]);
  const balloonsGroupRef = useRef<THREE.Group | null>(null);
  const sparklesPointsRef = useRef<THREE.Points | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean; lastX: number; lastY: number }>({
    x: 0,
    y: 0,
    isDown: false,
    lastX: 0,
    lastY: 0
  });

  const showToast = (text: string) => {
    setMessageToast(text);
    setTimeout(() => setMessageToast(null), 2500);
  };

  // Blow out or relight candle by index
  const toggleCandle = useCallback(
    (index: number) => {
      setCandlesLit(prev => {
        const next = [...prev];
        const willBeLit = !next[index];
        next[index] = willBeLit;

        if (!willBeLit) {
          birthdayAudio.playBlowOutSound();
          showToast(`Candle ${index + 1} blown out! 💨✨`);
          activityTracker.logEvent('candle', `Candle ${index + 1} Blown Out`, 'Alihaaa blew out a birthday candle 🎂💨', 'amber');
        } else {
          birthdayAudio.playSparkleChime();
          showToast(`Candle ${index + 1} relit! 🔥`);
        }

        // Check if all blown out
        const allBlownOut = next.every(lit => !lit);
        if (allBlownOut && !prev.every(lit => !lit)) {
          activityTracker.logEvent('candle', 'ALL 5 Candles Blown Out!', 'Alihaaa blew out all candles! Grand wishes released ✨🎉', 'rose');
          setTimeout(() => {
            triggerRealisticConfetti();
            triggerFireworks(4000);
            birthdayAudio.playSparkleChime();
            showToast('🎉 All candles blown out! Your wish has been sent to the stars! ✨💫');
            if (onAllCandlesBlownOut) {
              onAllCandlesBlownOut();
            }
          }, 300);
        }

        return next;
      });
    },
    [onAllCandlesBlownOut]
  );

  // Sync candle 3D meshes with state
  useEffect(() => {
    flameMeshesRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.visible = candlesLit[i];
      }
    });
    flameLightsRef.current.forEach((light, i) => {
      if (light) {
        light.intensity = candlesLit[i] ? 1.5 : 0;
      }
    });
  }, [candlesLit]);

  // Main Three.js setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with responsive FOV
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const cameraDistance = isMobile ? 8.8 : isTablet ? 7.6 : 6.8;
    const camera = new THREE.PerspectiveCamera(isMobile ? 50 : 45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, cameraDistance);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and performance optimization
    const perf = getPerformanceConfig();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    // Cap pixel ratio to 1.0 on mobile to guarantee smooth 60fps without lag
    renderer.setPixelRatio(isMobile ? 1.0 : perf.capPixelRatio ? Math.min(window.devicePixelRatio, 1.3) : 1.0);
    if (!perf.disableShadows && !isMobile) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      renderer.shadowMap.enabled = false;
    }
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(themeColor), 2.2);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const bottomFillLight = new THREE.PointLight(0xffeedd, 1.0, 10);
    bottomFillLight.position.set(0, -2, 2);
    scene.add(bottomFillLight);

    // 5. CAKE GROUP
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -0.4, 0);
    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;

    // Plate (Gold / Marble finish)
    const plateGeo = new THREE.CylinderGeometry(2.3, 2.0, 0.12, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3f0,
      metalness: 0.3,
      roughness: 0.2
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = 0;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // Plate rim ring
    const plateRimGeo = new THREE.TorusGeometry(2.28, 0.04, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const plateRim = new THREE.Mesh(plateRimGeo, goldMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.y = 0.06;
    cakeGroup.add(plateRim);

    // Cake Base Tier (Bottom)
    const tier1Geo = new THREE.CylinderGeometry(1.85, 1.85, 0.85, 48);
    const cakeCreamMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf6,
      roughness: 0.4,
      metalness: 0.05
    });
    const tier1 = new THREE.Mesh(tier1Geo, cakeCreamMat);
    tier1.position.y = 0.48;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Cake Ribbon accent on tier 1
    const ribbon1Geo = new THREE.CylinderGeometry(1.87, 1.87, 0.14, 48);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.3,
      metalness: 0.2
    });
    const ribbon1 = new THREE.Mesh(ribbon1Geo, ribbonMat);
    ribbon1.position.y = 0.2;
    cakeGroup.add(ribbon1);

    // Tier 1 Frosting pearls along the bottom rim
    const pearlGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.4
    });
    const pearlCount = 28;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 1.87, 0.1, Math.sin(angle) * 1.87);
      cakeGroup.add(pearl);
    }

    // Cake Middle Tier
    const tier2Geo = new THREE.CylinderGeometry(1.35, 1.35, 0.75, 48);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0xfff0f5,
      roughness: 0.35,
      metalness: 0.05
    });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = 1.25;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Ribbon accent on tier 2
    const ribbon2Geo = new THREE.CylinderGeometry(1.37, 1.37, 0.12, 48);
    const ribbon2 = new THREE.Mesh(ribbon2Geo, ribbonMat);
    ribbon2.position.y = 0.98;
    cakeGroup.add(ribbon2);

    // Strawberries / Cherries on Tier 1 shoulder
    const berryGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.15,
      metalness: 0.1
    });
    const berryCount = 10;
    for (let i = 0; i < berryCount; i++) {
      const angle = (i / berryCount) * Math.PI * 2;
      const berry = new THREE.Mesh(berryGeo, berryMat);
      berry.scale.set(1, 1.25, 1);
      berry.position.set(Math.cos(angle) * 1.6, 0.94, Math.sin(angle) * 1.6);
      cakeGroup.add(berry);
    }

    // Top Tier (Cream swirls and cake crown)
    const tier3Geo = new THREE.CylinderGeometry(0.88, 0.88, 0.65, 48);
    const tier3Mat = new THREE.MeshStandardMaterial({
      color: 0xfffaf6,
      roughness: 0.3,
      metalness: 0.05
    });
    const tier3 = new THREE.Mesh(tier3Geo, tier3Mat);
    tier3.position.y = 1.9;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    cakeGroup.add(tier3);

    // Top rim cream rosettes
    const rosetteGeo = new THREE.SphereGeometry(0.09, 14, 14);
    const rosetteMat = new THREE.MeshStandardMaterial({
      color: 0xffeedd,
      roughness: 0.2
    });
    const rosetteCount = 12;
    for (let i = 0; i < rosetteCount; i++) {
      const angle = (i / rosetteCount) * Math.PI * 2;
      const rosette = new THREE.Mesh(rosetteGeo, rosetteMat);
      rosette.scale.set(1, 1.2, 1);
      rosette.position.set(Math.cos(angle) * 0.78, 2.25, Math.sin(angle) * 0.78);
      cakeGroup.add(rosette);
    }

    // Top centerpiece flower or strawberry
    const centerBerry = new THREE.Mesh(berryGeo, berryMat);
    centerBerry.scale.set(1.4, 1.7, 1.4);
    centerBerry.position.set(0, 2.32, 0);
    cakeGroup.add(centerBerry);

    // 6. CANDLES & FLAMES
    const candlesGroup = new THREE.Group();
    cakeGroup.add(candlesGroup);
    candlesGroupRef.current = candlesGroup;

    const candleColors = [0xf472b6, 0xfbbf24, 0x60a5fa, 0xc084fc, 0x34d399];
    const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.55, 20);
    const wickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.1, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });

    // Tear-drop flame geometry
    const flameGeo = new THREE.ConeGeometry(0.065, 0.22, 16);
    flameGeo.translate(0, 0.11, 0);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.95
    });

    const innerFlameGeo = new THREE.ConeGeometry(0.035, 0.14, 16);
    innerFlameGeo.translate(0, 0.07, 0);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98
    });

    const candlePositions = [
      { x: 0, z: 0.45 },
      { x: 0.42, z: 0.15 },
      { x: 0.28, z: -0.38 },
      { x: -0.28, z: -0.38 },
      { x: -0.42, z: 0.15 }
    ];

    flameMeshesRef.current = [];
    flameLightsRef.current = [];
    smokeParticlesRef.current = [];

    candlePositions.forEach((pos, idx) => {
      const candleContainer = new THREE.Group();
      candleContainer.position.set(pos.x, 2.22, pos.z);
      candleContainer.userData = { candleIndex: idx };

      // Wax body
      const cMat = new THREE.MeshStandardMaterial({
        color: candleColors[idx % candleColors.length],
        roughness: 0.35,
        metalness: 0.1
      });
      const candleMesh = new THREE.Mesh(candleGeo, cMat);
      candleMesh.position.y = 0.27;
      candleMesh.castShadow = true;
      candleContainer.add(candleMesh);

      // Spiral stripe on candle
      const spiralRingGeo = new THREE.TorusGeometry(0.046, 0.008, 8, 16);
      const spiralMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let s = 0; s < 3; s++) {
        const ring = new THREE.Mesh(spiralRingGeo, spiralMat);
        ring.rotation.x = Math.PI / 2 + 0.2;
        ring.position.y = 0.12 + s * 0.14;
        candleContainer.add(ring);
      }

      // Wick
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.y = 0.58;
      candleContainer.add(wick);

      // Flame Group
      const flameGroup = new THREE.Group();
      flameGroup.position.y = 0.62;

      const outerFlame = new THREE.Mesh(flameGeo, flameMat.clone());
      const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
      flameGroup.add(outerFlame);
      flameGroup.add(innerFlame);

      candleContainer.add(flameGroup);
      flameMeshesRef.current.push(flameGroup as unknown as THREE.Mesh);

      // Point light for realistic candle glow
      const flameLight = new THREE.PointLight(0xff9900, 1.6, 2.5, 2);
      flameLight.position.y = 0.7;
      candleContainer.add(flameLight);
      flameLightsRef.current.push(flameLight);

      candlesGroup.add(candleContainer);
    });

    // 7. FLOATING 3D BALLOONS
    const balloonsGroup = new THREE.Group();
    scene.add(balloonsGroup);
    balloonsGroupRef.current = balloonsGroup;

    const balloonGeo = new THREE.SphereGeometry(0.48, 24, 24);
    balloonGeo.scale(1, 1.25, 0.95);
    const balloonMatList = [
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.15, metalness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.15, metalness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.35 }),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.15, metalness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.15, metalness: 0.35 })
    ];

    const balloonData: Array<{ mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; offset: number }> = [];
    const balloonOffsets = [
      { x: -3.2, y: 1.8, z: -1.2 },
      { x: 3.2, y: 2.2, z: -1.0 },
      { x: -2.4, y: 3.4, z: -2.0 },
      { x: 2.5, y: 3.2, z: -1.8 },
      { x: -3.6, y: 0.6, z: 0.5 },
      { x: 3.5, y: 0.8, z: 0.6 }
    ];

    balloonOffsets.forEach((bPos, i) => {
      const bMesh = new THREE.Mesh(balloonGeo, balloonMatList[i % balloonMatList.length]);
      bMesh.position.set(bPos.x, bPos.y, bPos.z);

      // Balloon knot
      const knotGeo = new THREE.ConeGeometry(0.07, 0.08, 12);
      const knot = new THREE.Mesh(knotGeo, bMesh.material);
      knot.position.y = -0.6;
      knot.rotation.x = Math.PI;
      bMesh.add(knot);

      // Balloon string line
      const stringPoints = [new THREE.Vector3(0, -0.6, 0), new THREE.Vector3(0, -2.4, 0)];
      const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
      const stringMat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
      const stringLine = new THREE.Line(stringGeo, stringMat);
      bMesh.add(stringLine);

      balloonsGroup.add(bMesh);
      balloonData.push({
        mesh: bMesh,
        basePos: new THREE.Vector3(bPos.x, bPos.y, bPos.z),
        speed: 0.8 + (i % 3) * 0.25,
        offset: i * 1.3
      });
    });

    // 8. ORBITING SPARKLE & STAR PARTICLES
    const sparklesCount = isMobile ? 120 : 250;
    const sparklePositions = new Float32Array(sparklesCount * 3);
    const sparkleColors = new Float32Array(sparklesCount * 3);
    const colorPalette = [
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xf472b6),
      new THREE.Color(0xffffff),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xc084fc)
    ];

    for (let i = 0; i < sparklesCount; i++) {
      const radius = 1.6 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.2) * Math.PI;

      sparklePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      sparklePositions[i * 3 + 1] = 0.2 + Math.random() * 3.8;
      sparklePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      sparkleColors[i * 3] = chosenColor.r;
      sparkleColors[i * 3 + 1] = chosenColor.g;
      sparkleColors[i * 3 + 2] = chosenColor.b;
    }

    const sparklesGeo = new THREE.BufferGeometry();
    sparklesGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparklesGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,240,200,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const sparklesMat = new THREE.PointsMaterial({
      size: isMobile ? 0.16 : 0.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const sparklesPoints = new THREE.Points(sparklesGeo, sparklesMat);
    scene.add(sparklesPoints);
    sparklesPointsRef.current = sparklesPoints;

    // 9. ANIMATION LOOP with auto-pause optimization
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;
    let observer: IntersectionObserver | null = null;

    if (perf.pauseWhenScrolled && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        entries => {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // If user is scrolled down reading wishes or looking at photos, pause Three.js draw calls!
      if (perf.pauseWhenScrolled && !isVisible) {
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Cake auto-rotation when user is not manually dragging
      if (cakeGroupRef.current && isRotating && !mousePosRef.current.isDown) {
        cakeGroupRef.current.rotation.y += 0.005;
      }

      // Flame flicker
      flameMeshesRef.current.forEach((mesh, idx) => {
        if (mesh && mesh.visible) {
          const flicker = Math.sin(elapsedTime * 14 + idx * 2.1) * 0.08 + Math.cos(elapsedTime * 22 + idx) * 0.04;
          mesh.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
          mesh.rotation.z = Math.sin(elapsedTime * 8 + idx) * 0.08;
        }
      });

      // Candle lights flicker
      flameLightsRef.current.forEach((light, idx) => {
        if (light && light.intensity > 0) {
          light.intensity = 1.3 + Math.sin(elapsedTime * 15 + idx * 1.7) * 0.4;
        }
      });

      // Floating balloons motion
      balloonData.forEach(b => {
        const t = elapsedTime * b.speed + b.offset;
        b.mesh.position.y = b.basePos.y + Math.sin(t) * 0.3;
        b.mesh.position.x = b.basePos.x + Math.sin(t * 0.7) * 0.12;
        b.mesh.rotation.z = Math.sin(t * 0.5) * 0.08;
        b.mesh.rotation.x = Math.cos(t * 0.4) * 0.06;
      });

      // Sparkles slow spin
      if (sparklesPointsRef.current) {
        sparklesPointsRef.current.rotation.y = elapsedTime * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. RESIZE HANDLER (crucial for responsive design across all devices!)
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      const mobileCheck = newWidth < 640;
      const tabletCheck = newWidth >= 640 && newWidth < 1024;

      camera.aspect = newWidth / newHeight;
      camera.fov = mobileCheck ? 52 : tabletCheck ? 48 : 44;
      camera.position.z = mobileCheck ? 8.6 : tabletCheck ? 7.6 : 6.8;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(perf.capPixelRatio ? Math.min(window.devicePixelRatio, 1.3) : 1.0);
    };

    window.addEventListener('resize', handleResize);

    // 11. CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [themeColor]);

  // Pointer interaction for 3D rotation and clicking candles
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    mousePosRef.current.isDown = true;
    mousePosRef.current.lastX = e.clientX;
    mousePosRef.current.lastY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mousePosRef.current.isDown || !cakeGroupRef.current) return;
    const deltaX = e.clientX - mousePosRef.current.lastX;
    cakeGroupRef.current.rotation.y += deltaX * 0.008;
    mousePosRef.current.lastX = e.clientX;
    mousePosRef.current.lastY = e.clientY;
  };

  const handlePointerUp = () => {
    mousePosRef.current.isDown = false;
  };

  // Raycasting for clicking specific candles
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !candlesGroupRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(candlesGroupRef.current.children, true);
    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      while (current && current.userData.candleIndex === undefined && current.parent) {
        current = current.parent;
      }
      if (current && current.userData.candleIndex !== undefined) {
        toggleCandle(current.userData.candleIndex);
      }
    }
  };

  // Blow out all candles button handler
  const blowOutAll = () => {
    setCandlesLit([false, false, false, false, false]);
    birthdayAudio.playBlowOutSound();
    birthdayAudio.playSparkleChime();
    triggerRealisticConfetti();
    triggerFireworks(3500);
    showToast('✨ All candles blown out! Make a heartfelt wish! 🎂💫');
    if (onAllCandlesBlownOut) onAllCandlesBlownOut();
  };

  const relightAll = () => {
    setCandlesLit([true, true, true, true, true]);
    birthdayAudio.playSparkleChime();
    showToast('🔥 Candles relit with sparkling warmth!');
  };

  return (
    <div className="relative w-full h-full select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
        aria-label="Interactive 3D Birthday Cake"
      />

      {/* Floating interactive feedback toast */}
      {messageToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-pink-400/40 text-white text-xs sm:text-sm font-medium shadow-xl animate-fade-in text-center whitespace-nowrap pointer-events-none">
          {messageToast}
        </div>
      )}

      {/* Interactive Controls Bar for 3D Cake */}
      {interactive && (
        <div className="absolute bottom-3 inset-x-0 z-10 flex flex-wrap items-center justify-center gap-2 px-3">
          <button
            onClick={blowOutAll}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-600/80 hover:bg-pink-500 text-white shadow-lg backdrop-blur-md border border-pink-300/40 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
            title="Blow out all candles"
          >
            <span>💨</span> Blow Out Candles
          </button>
          <button
            onClick={relightAll}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/80 hover:bg-amber-400 text-white shadow-lg backdrop-blur-md border border-amber-300/40 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
            title="Relight all candles"
          >
            <span>🔥</span> Relight
          </button>
          <button
            onClick={() => setIsRotating(prev => !prev)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white/90 backdrop-blur-md border border-white/20 transition-all"
            title="Toggle 3D auto-spin"
          >
            {isRotating ? '⏸ Pause Spin' : '▶ Spin'}
          </button>
        </div>
      )}

      {/* Touch/Mouse hint */}
      <div className="absolute top-2 right-3 z-10 pointer-events-none text-[11px] text-white/50 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
        👆 Drag to rotate &bull; Tap candles
      </div>
    </div>
  );
};
