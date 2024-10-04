import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef } from "react";
import { FileInfo } from "../types/types";
import { Points } from "~/utils/three";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Scanline,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { Group } from "three";
import { BlendFunction } from "postprocessing";
import { useEffect, useState } from "react"; // Added useState

const darkModeColor = "FFFFFF";
const lightModeColor = "222222";
const minRadius = 7.5;
const maxRadius = 15;
const depth = 2;
const numPoints = 2500;

const PointCircle = () => {
  const [innerColor, setInnerColor] = useState(lightModeColor);
  const [outerColor, setOuterColor] = useState(lightModeColor);

  useEffect(() => {
    const updateColors = () => {
      const isDarkMode = document.body.classList.contains("dark");
      setInnerColor(isDarkMode ? darkModeColor : lightModeColor);
      setOuterColor(isDarkMode ? darkModeColor : lightModeColor);
    };
    updateColors();
    window.addEventListener("classlistchange", updateColors);

    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("classlistchange", updateColors);
    };
  }, []);

  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, -5, -33]} rotation={[-0.4, -0.1, 0]}>
      {Points({
        innerColor: innerColor,
        outerColor: outerColor,
        minRadius,
        maxRadius,
        depth,
        numPoints,
      }).pointsInner.map((point) => (
        <Point
          key={point.idx}
          position={[point.position[0], point.position[1], point.position[2]]}
          color={point.color}
        />
      ))}
      {Points({
        innerColor: innerColor,
        outerColor: outerColor,
        minRadius,
        maxRadius,
        depth,
        numPoints,
      }).pointsOuter.map((point) => (
        <Point
          key={point.idx}
          position={[point.position[0], point.position[1], point.position[2]]}
          color={point.color}
        />
      ))}
    </group>
  );
};

const Point = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => {
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
          bokehScale={0.2}
          height={480}
          blendFunction={BlendFunction.COLOR_DODGE}
        />
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={3}
          height={300}
          opacity={2}
        />
        <SMAA />
        <Scanline opacity={0.3} />
        <Vignette offset={0.1} darkness={1.1} />
      </EffectComposer>
      <ambientLight castShadow intensity={0.4 * Math.PI} />
      <PointCircle />
    </Canvas>
  );
};

export default ThreeJS;
