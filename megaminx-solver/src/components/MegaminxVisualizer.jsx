import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';

// Standard Megaminx colors (matched to physical puzzle)
const COLORS = {
  0: '#FFFFFF', // white (U - top)
  1: '#0000FF', // blue (F - front)
  2: '#FFD700', // golden yellow (R - right)
  3: '#800080', // purple (BR - back right)
  4: '#008000', // green (BL - back left)
  5: '#FF0000', // red (L - left)
  6: '#A0522D', // brown (DBR - down back right)
  7: '#00CED1', // turquoise (DBL - down back left)
  8: '#FFA500', // orange (DFL - down front left)
  9: '#90EE90', // light green (DFR - down front right)
  10: '#FF69B4', // pink (DB - down back)
  11: '#F0E68C', // khaki (D - down)
};

// Constants for dodecahedron construction
const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;

function Pentagon({ position, rotation, color, scale = 1, onClick }) {
  const vertices = useMemo(() => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * TAU) / 5 - Math.PI / 10;
      points.push(new THREE.Vector2(Math.cos(angle), Math.sin(angle)));
    }
    return points;
  }, []);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i].x, vertices[i].y);
    }
    shape.lineTo(vertices[0].x, vertices[0].y);
    return shape;
  }, [vertices]);

  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <shapeGeometry args={[shape]} />
      <meshPhongMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        shininess={80}
        specular={new THREE.Color(0x333333)}
      />
    </mesh>
  );
}

function Face({ position, rotation, colors, scale = 1, onClick }) {
  const groupRef = useRef();

  return (
    <group position={position} rotation={rotation} scale={scale} ref={groupRef}>
      {/* Center pentagon */}
      <Pentagon 
        color={COLORS[colors[0]]} 
        scale={0.82} 
        onClick={onClick}
      />
      
      {/* Edge pentagons */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * TAU) / 5 - Math.PI / 10;
        const radius = 0.82;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <Pentagon
            key={i}
            position={[x, y, 0.01]}
            rotation={[0, 0, angle + Math.PI]}
            color={COLORS[colors[i + 1]]}
            scale={0.42}
            onClick={onClick}
          />
        );
      })}
    </group>
  );
}

function Megaminx({ state, onFaceClick }) {
  const groupRef = useRef();

  const faceData = useMemo(() => {
    const positions = [];
    const rotations = [];
    
    // Calculate vertices using golden ratio
    const t = PHI;
    const s = 1 / t;
    
    // Define vertices for a regular dodecahedron
    const vertices = [
      // Cubic vertices (replacing [±1, ±1, ±1])
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      
      // Rectangular vertices (replacing [0, ±t, ±s])
      [0, t, s], [0, t, -s], [0, -t, s], [0, -t, -s],
      
      // More rectangular vertices (replacing [±s, 0, ±t])
      [s, 0, t], [s, 0, -t], [-s, 0, t], [-s, 0, -t],
      
      // Final rectangular vertices (replacing [±t, ±s, 0])
      [t, s, 0], [t, -s, 0], [-t, s, 0], [-t, -s, 0]
    ].map(v => v.map(c => c * 1.2));  // Scale up

    // Define faces with correct adjacency
    const faceIndices = [
      [0, 16, 2, 13, 12],    // U (white)
      [0, 12, 1, 4, 16],     // F (blue)
      [0, 4, 5, 3, 2],       // R (yellow)
      [2, 3, 15, 14, 13],    // BR (purple)
      [12, 13, 14, 11, 1],   // BL (green)
      [1, 11, 10, 8, 4],     // L (red)
      [3, 5, 7, 19, 15],     // DBR (brown)
      [14, 15, 19, 18, 11],  // DBL (turquoise)
      [8, 10, 18, 17, 6],    // DFL (orange)
      [5, 4, 8, 6, 7],       // DFR (light green)
      [10, 11, 18, 19, 17],  // DB (pink)
      [6, 17, 19, 7, 9]      // D (khaki)
    ];

    // Calculate face centers and rotations
    faceIndices.forEach(face => {
      const center = new THREE.Vector3();
      face.forEach(vi => {
        const vertex = vertices[vi];
        center.add(new THREE.Vector3(...vertex));
      });
      center.divideScalar(face.length);
      
      // Scale positions for better spacing
      positions.push([center.x * 1.1, center.y * 1.1, center.z * 1.1]);

      // Calculate face normal and rotation
      const normal = center.clone().normalize();
      const rotationMatrix = new THREE.Matrix4();
      const up = Math.abs(normal.y) > 0.9 
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(0, 1, 0);
      
      rotationMatrix.lookAt(
        new THREE.Vector3(0, 0, 0),
        normal,
        up
      );
      
      const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix);
      rotations.push([rotation.x, rotation.y, rotation.z]);
    });

    return { positions, rotations };
  }, []);

  return (
    <group ref={groupRef} rotation={[Math.PI / 6, Math.PI / 6, 0]}>
      {faceData.positions.map((position, index) => (
        <Face
          key={index}
          position={position}
          rotation={faceData.rotations[index]}
          colors={state[index]}
          onClick={(e) => {
            e.stopPropagation();
            onFaceClick(index);
          }}
          scale={0.62}
        />
      ))}
    </group>
  );
}

export default function MegaminxVisualizer({ state, onFaceClick }) {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: '#2A2A2A' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#2A2A2A']} />
        
        {/* Enhanced lighting for better 3D visualization */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 0, 10]} intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        
        {/* Scene */}
        <Megaminx state={state} onFaceClick={onFaceClick} />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={6}
          maxDistance={20}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          target={[0, 0, 0]}
        />

        {/* Performance monitor */}
        <Stats />
      </Suspense>
    </Canvas>
  );
} 