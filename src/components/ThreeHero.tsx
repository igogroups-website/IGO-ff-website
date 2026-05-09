'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function FloatingProduce({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * (speed * 0.8);
  });

  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Abstract Organic Shapes representing produce */}
      <FloatingProduce position={[-4, 2, 0]} color="#10b981" speed={1.2} distort={0.4} /> {/* Green Veggie */}
      <FloatingProduce position={[4, -2, 2]} color="#f59e0b" speed={0.8} distort={0.3} /> {/* Orange Fruit */}
      <FloatingProduce position={[2, 3, -2]} color="#ef4444" speed={1.5} distort={0.5} /> {/* Red Tomato */}
      <FloatingProduce position={[-3, -3, 1]} color="#8b5cf6" speed={1} distort={0.2} /> {/* Purple Brinjal */}
      
      <Environment preset="studio" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none md:pointer-events-auto">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
