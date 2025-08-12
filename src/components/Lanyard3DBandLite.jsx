import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, useTexture } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

function useIsMobile() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1024px)').matches;
  }, []);
}

function BadgeCard({ frontUrl, backUrl, strapColor = '#1f1f1f', showGloss = true }) {
  const ref = useRef();
  const frontTex = frontUrl ? useTexture(frontUrl) : null;
  const backTex = backUrl ? useTexture(backUrl) : null;

  useEffect(() => {
    [frontTex, backTex].forEach((t) => {
      if (t) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.generateMipmaps = false;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.anisotropy = 1;
        t.needsUpdate = true;
      }
    });
  }, [frontTex, backTex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.05;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.06 - 0.15;
  });

  return (
    <group ref={ref}>
      {/* Strap ring */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}> 
        <torusGeometry args={[0.12, 0.02, 16, 64]} />
        <meshStandardMaterial color={strapColor} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Strap segment */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshStandardMaterial color={strapColor} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Card core */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.06]} />
        <meshPhysicalMaterial color="#111827" metalness={0.2} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.2} />
      </mesh>
      {/* Front */}
      {frontTex && (
        <mesh position={[0, 0, 0.032]}> 
          <planeGeometry args={[1.56, 2.36]} />
          <meshBasicMaterial map={frontTex} toneMapped={false} />
        </mesh>
      )}
      {/* Back */}
      {backTex && (
        <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]}> 
          <planeGeometry args={[1.56, 2.36]} />
          <meshBasicMaterial map={backTex} toneMapped={false} />
        </mesh>
      )}
      {/* Gloss */}
      {showGloss && (
        <mesh position={[0, 0.2, 0.034]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[1.5, 0.6]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.3} metalness={0} clearcoat={0.5} />
        </mesh>
      )}
    </group>
  );
}

function BandRope({ cardRef }) {
  const band = useRef();
  const texture = useTexture('/assets/images/tag_texture.png', (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(-3, 1);
  });

  const fixed = useMemo(() => new THREE.Vector3(0, 4.6, 0), []);
  const j1 = useRef(new THREE.Vector3(0.5, 4.6, 0));
  const j2 = useRef(new THREE.Vector3(1.0, 4.6, 0));
  const j3 = useRef(new THREE.Vector3(1.5, 4.6, 0));
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    j3.current.clone(), j2.current.clone(), j1.current.clone(), fixed.clone()
  ]), [fixed]);

  useFrame((state, delta) => {
    const targetCard = cardRef.current?.position ?? new THREE.Vector3();
    const topCard = new THREE.Vector3().copy(targetCard).add(new THREE.Vector3(0, 1.45, 0));

    // Damped follow for intermediate joints to simulate rope slack
    j3.current.lerp(topCard, 1 - Math.exp(-delta * 10));
    const mid = new THREE.Vector3().addVectors(j3.current, fixed).multiplyScalar(0.5);
    j2.current.lerp(mid, 1 - Math.exp(-delta * 6));
    const mid2 = new THREE.Vector3().addVectors(j2.current, fixed).multiplyScalar(0.5);
    j1.current.lerp(mid2, 1 - Math.exp(-delta * 6));

    curve.points[0].copy(j3.current);
    curve.points[1].copy(j2.current);
    curve.points[2].copy(j1.current);
    curve.points[3].copy(fixed);
    if (band.current) band.current.geometry.setPoints(curve.getPoints(32));
  });

  return (
    <mesh ref={band}>
      {/* provided by extend */}
      <meshLineGeometry />
      <meshLineMaterial color="white" depthTest={false} resolution={new THREE.Vector2(2, 1)} useMap={1} map={texture} lineWidth={1} />
    </mesh>
  );
}

function InteractiveBadge() {
  const isMobile = useIsMobile();
  const cardRef = useRef();
  const dragged = useRef(null);
  const vec = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3(2, 0, 0));

  useFrame((state, delta) => {
    if (!cardRef.current) return;
    // Damped card motion toward target
    cardRef.current.position.lerp(target.current, 1 - Math.exp(-delta * 8));
  });

  const onPointerDown = (e) => {
    if (!cardRef.current) return;
    e.target.setPointerCapture?.(e.pointerId);
    dragged.current = new THREE.Vector3().copy(e.point).sub(vec.current.copy(cardRef.current.position));
  };
  const onPointerUp = (e) => {
    e.target.releasePointerCapture?.(e.pointerId);
    dragged.current = null;
  };
  const onPointerMove = (e) => {
    if (!dragged.current) return;
    const camera = e.camera;
    vec.current.set(e.pointer.x, e.pointer.y, 0.5).unproject(camera);
    dir.current.copy(vec.current).sub(camera.position).normalize();
    vec.current.add(dir.current.multiplyScalar(camera.position.length()));
    target.current.set(vec.current.x - dragged.current.x, vec.current.y - dragged.current.y, vec.current.z - dragged.current.z);
  };

  return (
    <>
      <Suspense fallback={null}>
        <group
          ref={cardRef}
          position={[2, 0, 0]}
          scale={2.25}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerMove={onPointerMove}
        >
          <BadgeCard frontUrl={'/depan.png'} backUrl={'/belakang.png'} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <BandRope cardRef={cardRef} />
      </Suspense>
      {!isMobile && (
        <ContactShadows position={[0, -1.5, 0]} opacity={0.25} scale={10} blur={2.5} far={4} />
      )}
    </>
  );
}

export default function Lanyard3DBandLite() {
  const isMobile = useIsMobile();
  if (isMobile) return null;
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }} style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
      <ambientLight intensity={Math.PI} />
      <InteractiveBadge />
      <Environment background blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
// removed
