import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { TextureLoader, LinearFilter, SRGBColorSpace } from 'three';

// Simple swinging card placeholder; will be replaced with user's design
function Card({ frontUrl, backUrl, strapColor = '#6b7280', showGloss = true, ...props }) {
  const ref = useRef();
  // Load textures inside the Canvas context
  const frontTex = frontUrl ? useLoader(TextureLoader, frontUrl) : null;
  const backTex = backUrl ? useLoader(TextureLoader, backUrl) : null;
  // Optimize textures for UI (faster upload on mobile GPUs)
  useEffect(() => {
    if (frontTex) {
      frontTex.colorSpace = SRGBColorSpace;
      frontTex.generateMipmaps = false;
      frontTex.minFilter = LinearFilter;
      frontTex.magFilter = LinearFilter;
      frontTex.anisotropy = 1;
      frontTex.needsUpdate = true;
    }
    if (backTex) {
      backTex.colorSpace = SRGBColorSpace;
      backTex.generateMipmaps = false;
      backTex.minFilter = LinearFilter;
      backTex.magFilter = LinearFilter;
      backTex.anisotropy = 1;
      backTex.needsUpdate = true;
    }
  }, [frontTex, backTex]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.05;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.06 - 0.15;
  });
  return (
    <group ref={ref} {...props}>
      {/* Strap */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}> 
        <torusGeometry args={[0.12, 0.02, 16, 64]} />
        <meshStandardMaterial color={strapColor} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Small strap segment to the card */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshStandardMaterial color={strapColor} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Card body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.06]} />
        <meshPhysicalMaterial color="#111827" metalness={0.2} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.2} />
      </mesh>
      {/* Front face with user texture */}
  {frontTex && (
        <mesh position={[0, 0, 0.032]}> 
          <planeGeometry args={[1.56, 2.36]} />
          <meshBasicMaterial map={frontTex} toneMapped={false} />
        </mesh>
      )}
      {/* Back face */}
      {backTex && (
        <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]}> 
          <planeGeometry args={[1.56, 2.36]} />
          <meshBasicMaterial map={backTex} toneMapped={false} />
        </mesh>
      )}
      {/* Gloss overlay (subtle) */}
      {showGloss && (
        <mesh position={[0, 0.2, 0.034]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[1.5, 0.6]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.3} metalness={0} clearcoat={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Lightweight placeholder rendered while textures are loading (Suspense fallback)
function CardPlaceholder({ strapColor = '#6b7280', ...props }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = Math.sin(t * 0.6) * 0.05;
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.06 - 0.15;
    }
  });
  return (
    <group ref={ref} {...props}>
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}> 
        <torusGeometry args={[0.12, 0.02, 16, 64]} />
        <meshStandardMaterial color={strapColor} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshStandardMaterial color={strapColor} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.06]} />
        <meshStandardMaterial color="#1f2937" metalness={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.032]}> 
        <planeGeometry args={[1.56, 2.36]} />
        <meshStandardMaterial color="#111827" metalness={0} roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Lanyard3D({ frontUrl, backUrl, strapColor = '#1f1f1f', showGloss = true, className }) {
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  }, []);

  // Do not render on mobile at all (safety guard if used elsewhere)
  if (isMobile) {
    return null;
  }

  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 42 }}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ antialias: false, powerPreference: 'low-power', alpha: true, stencil: false }}
        shadows={!isMobile}
      >
        {/* Simple local lights (avoid remote HDRI fetch) */}
        <hemisphereLight intensity={0.6} groundColor="#111111" />
        <directionalLight position={[5, 5, 5]} castShadow={!isMobile} intensity={0.8} />
        <Suspense fallback={
          <>
            <CardPlaceholder strapColor={strapColor} />
            {/* Soft floor shadow hint */}
            {!isMobile && (
              <ContactShadows position={[0, -1.5, 0]} opacity={0.2} scale={10} blur={3} far={4} frames={1} />
            )}
          </>
        }>
          <Card frontUrl={frontUrl} backUrl={backUrl} strapColor={strapColor} showGloss={showGloss} />
          {/* Keep contact shadows but tone down on mobile */}
          {!isMobile && (
            <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={2.5} far={4} />
          )}
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} minDistance={3} maxDistance={7} />
      </Canvas>
    </div>
  );
}
