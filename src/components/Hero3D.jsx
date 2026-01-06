import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Environment, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

function GlassObject({ dpr }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;
      meshRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Optimized Geometry density */}
        <torusKnotGeometry args={[1, 0.3, 64, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={4} // Greatly reduced
          resolution={512} // Fixed lower resolution for refraction
          thickness={0.4}
          chromaticAberration={0.04}
          anisotropy={0.1}
          distortion={0.3}
          distortionScale={0.3}
          temporalDistortion={0.05}
          clearcoat={0.5}
          attenuationDistance={0.5}
          attenuationColor="#3dcfd4"
          color="#ffffff"
          bg="#0a0a0a"
        />
      </mesh>
    </Float>
  );
}

const Hero3D = () => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 35 }} 
          dpr={dpr} 
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.4} />
          <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={0.8} />
          
          <GlassObject />
          
          <Environment preset="city" blur={1} />
        </Canvas>
      </div>

      {/* Hero Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <h1 
            className="text-8xl md:text-[12rem] font-black tracking-tighter text-white mix-blend-difference"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            HARUME
          </h1>
          <p className="text-sm md:text-base font-bold tracking-[1em] text-white/30 uppercase">
            Transparent Visuals & Motion
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
          <div className="w-[1px] h-12 bg-white" />
          <p className="text-[10px] font-bold tracking-[0.4em] text-white uppercase transform rotate-90 origin-left translate-x-1">
            SCROLL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
