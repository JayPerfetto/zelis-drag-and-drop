import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text, Stage, OrbitControls, Sphere } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { FileInfo } from "../types/types";
import { formatFileSize } from "~/utils/formatFileSize";
import * as THREE from "three";
import { pointsInner, pointsOuter } from "~/utils/three";

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
      {/* <Stage intensity={1} environment="city"> */}
      {/* <Model files={files} /> */}
      {/* </Stage> */}
      <ambientLight intensity={0.4 * Math.PI} />
      <PointCircle />
    </Canvas>
  );
};

export default ThreeJS;
