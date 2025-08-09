import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { TextureLoader } from 'three';

// Simple swinging card placeholder; will be replaced with user's design
function Card({ frontUrl, backUrl, strapColor = '#6b7280', showGloss = true, ...props }) {
  const ref = useRef();
  // Load textures inside the Canvas context
  const frontTex = frontUrl ? useLoader(TextureLoader, frontUrl) : null;
  const backTex = backUrl ? useLoader(TextureLoader, backUrl) : null;
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

export default function Lanyard3D({ frontUrl, backUrl, strapColor = '#1f1f1f', showGloss = true, className }) {
  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <Canvas camera={{ position: [0, 0.3, 5], fov: 42 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} castShadow intensity={0.8} />
        <Suspense fallback={null}>
          <Card frontUrl={frontUrl} backUrl={backUrl} strapColor={strapColor} showGloss={showGloss} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={10} blur={2.5} far={4} />
        </Suspense>
  <OrbitControls enablePan={false} enableZoom={false} minDistance={3} maxDistance={7} />
      </Canvas>
    </div>
  );
}
