import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import { FileInfo } from "../types/types";
import { pointsInner, pointsOuter } from "~/utils/three";
import * as THREE from "three";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Pixelation,
  Scanline,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const PointCircle = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={ref} position={[0, -5, -33]} rotation={[-0.4, -0.1, 0]}>
      {pointsInner.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {pointsOuter.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
    </group>
  );
};

const Point = ({ position, color }) => {
  return (
    <Sphere scale={0.04} position={position} args={[1, 10, 10]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
      />
    </Sphere>
  );
};

const ThreeJS = ({ files }: { files: FileInfo[] }) => {
  return (
    <Canvas camera={{ position: [40, -10, 20], fov: 50 }}>
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.01}
          bokehScale={0.5}
          height={480}
        />
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
          opacity={3}
        />
        <SMAA />
        <Scanline opacity={0.4} />
        <Noise opacity={0.025} />
        <Vignette offset={0.1} darkness={1.1} />
      </EffectComposer>
      <ambientLight castShadow intensity={0.4 * Math.PI} />
      <PointCircle />
    </Canvas>
  );
};

export default ThreeJS;
