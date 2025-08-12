import * as THREE from 'three';
import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { Physics, RigidBody, BallCollider, CuboidCollider, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

function BandInner({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { nodes, materials } = useGLTF('/assets/3d/card.glb');
  const texture = useTexture('/assets/images/tag_texture.png');

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]));

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !band.current || !card.current) return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    const j1t = j1.current.translation();
    const j2t = j2.current.translation();
    const j3t = j3.current.translation();
    const fixedT = fixed.current.translation();

    const lerpPoint = (from, to) => {
      const clamped = Math.max(0.1, Math.min(1, from.distanceTo(to)));
      return from.clone().lerp(to, delta * (minSpeed + clamped * (maxSpeed - minSpeed)));
    };

    const j1L = lerpPoint(new THREE.Vector3().copy(j1t), new THREE.Vector3().copy(j1t));
    const j2L = lerpPoint(new THREE.Vector3().copy(j2t), new THREE.Vector3().copy(j2t));

    curve.points[0].copy(j3t);
    curve.points[1].copy(j2L);
    curve.points[2].copy(j1L);
    curve.points[3].copy(fixedT);
    band.current.geometry.setPoints(curve.getPoints(32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false);
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4.6, 0]}>
        <RigidBody ref={fixed} type="fixed" colliders={false} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} colliders={false}> <BallCollider args={[0.1]} /> </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} colliders={false}> <BallCollider args={[0.1]} /> </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} colliders={false}> <BallCollider args={[0.1]} /> </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          colliders={false}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.25, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(e) => ((e.target)?.releasePointerCapture?.(e.pointerId), setDragged(false))}
            onPointerDown={(e) => (
              (e.target)?.setPointerCapture?.(e.pointerId),
              card.current && setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {/* Badge meshes from GLTF */}
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      {/* Strap band using meshline */}
      <mesh ref={band}>
        {/* provided by extend */}
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={new THREE.Vector2(2, 1)} useMap={1} map={texture} repeat={new THREE.Vector2(-3, 1)} lineWidth={1} />
      </mesh>
    </>
  );
}

export default function Lanyard3DBandScene() {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
  if (isMobile) return null;
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }} style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}>
      <ambientLight intensity={Math.PI} />
      <Physics debug={false} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Suspense fallback={null}>
          <BandInner />
        </Suspense>
      </Physics>
      <Environment background blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
  <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

useGLTF.preload('/assets/3d/card.glb');
useTexture.preload('/assets/images/tag_texture.png');
// removed
