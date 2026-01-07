import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon';
import { 
  MeshTransmissionMaterial, 
  Environment, 
  Float, 
  Text, 
  PresentationControls,
  ContactShadows,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

// --- Components ---

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial transparent opacity={0.2} />
    </mesh>
  );
}

function Wall({ position, rotation }) {
    usePlane(() => ({ position, rotation }));
    return null; // Invisible walls
}

function Sphere({ position, color = "#ffffff", ...props }) {
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position, 
    args: [1],
    ...props 
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow onClick={() => api.applyImpulse([0, 10, 0], [0, 0, 0])}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0.3}
        distortionScale={0.3}
        temporalDistortion={0.05}
        color={color}
      />
    </mesh>
  );
}

// GLTF Model with Physics
function Model({ url, position, ...props }) {
  const { scene } = useGLTF(url);
  // Use a sphere collider for the model for performance and stability
  const [ref, api] = useSphere(() => ({ 
    mass: 2, 
    position, 
    args: [1.5], 
    ...props 
  }));

  return (
    <primitive 
        ref={ref} 
        object={scene.clone()} 
        scale={2} 
        onClick={() => api.applyImpulse([0, 15, 0], [0, 0, 0])}
        castShadow
    />
  );
}

function Box({ position, color = "#3dcfd4", ...props }) {
  const [ref, api] = useBox(() => ({ 
    mass: 1, 
    position, 
    args: [1.5, 1.5, 1.5],
    ...props 
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow onClick={() => api.applyImpulse([0, 10, 0], [0, 0, 0])}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshPhysicalMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.1} 
        clearcoat={1}
      />
    </mesh>
  );
}

// Example of how to use a custom GLB model with physics
// (Using a placeholder sphere for physics to keep it simple and performant)
function CustomModel({ url, position, ...props }) {
    // If you have a specific GLB, you can use it here
    // const { scene } = useGLTF(url);
    // const [ref] = useSphere(() => ({ mass: 5, position, args: [1.2], ...props }));
    // return <primitive ref={ref} object={scene} scale={1.5} />;
    return null; 
}

function PhysicsScene() {
    const { viewport } = useThree();
    
    // Create random items
    const items = useRef([...Array(18)].map((_, i) => ({
        id: i,
        position: [
            (Math.random() - 0.5) * 12,
            10 + Math.random() * 20,
            (Math.random() - 0.5) * 5
        ],
        type: i % 3 === 0 ? 'box' : 'sphere',
        color: i % 2 === 0 ? '#3dcfd4' : '#ffffff'
    })));

    return (
        <Physics gravity={[0, -9.81, 0]}>
            <Plane position={[0, -5, 0]} />
            
            {/* Example Model (A dog or coffee cup) */}
            <Model 
                url="https://raw.githubusercontent.com/pmndrs/drei-assets/master/dog.glb" 
                position={[0, 15, 0]} 
            />

            {/* Bound the scene */}
            <Wall position={[-viewport.width / 2 - 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
            <Wall position={[viewport.width / 2 + 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
            <Wall position={[0, 0, -5]} rotation={[0, 0, 0]} />
            <Wall position={[0, 0, 5]} rotation={[Math.PI, 0, 0]} />

            {items.current.map((item) => (
                item.type === 'box' ? (
                    <Box key={item.id} position={item.position} color={item.color} />
                ) : (
                    <Sphere key={item.id} position={item.position} color={item.color} />
                )
            ))}
            
            <ContactShadows 
                position={[0, -4.9, 0]} 
                opacity={0.4} 
                scale={20} 
                blur={2.5} 
                far={4.5} 
            />
        </Physics>
    );
}

const Physics3DHero = () => {
    return (
        <div className="relative w-full h-screen bg-[#F8F9FA] overflow-hidden">
            <Canvas
                shadows
                camera={{ position: [0, 0, 15], fov: 35 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                
                <Suspense fallback={null}>
                    <PhysicsScene />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                <h1 
                    className="text-8xl md:text-[12rem] font-black tracking-tighter text-black mix-blend-multiply opacity-5"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    3D MOTION
                </h1>
                
                <div className="flex flex-col items-center gap-2 mt-[-2rem]">
                    <h2 className="text-5xl md:text-7xl font-black text-black">HARUME</h2>
                    <p className="text-sm font-bold tracking-[1em] text-black/40 uppercase">
                        Interactive Physics
                    </p>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.2em] text-black/20 uppercase">
                Click objects to interact
            </div>
        </div>
    );
};

export default Physics3DHero;
