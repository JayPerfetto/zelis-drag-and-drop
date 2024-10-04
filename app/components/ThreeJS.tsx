import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
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
import { useEffect, useState } from "react";
import React from "react";

const darkModeColor1 = "FFFFFF"; // white
const darkModeColor2 = "BB86FC"; // purple
const lightModeColor1 = "222222"; // dark gray
const lightModeColor2 = "419bf9"; // light blue
const minRadius = 7.5;
const maxRadius = 15;
const depth = 2;
const numPoints = 1250;
const PointCircle = ({ darkMode }: { darkMode: boolean }) => {
  const [innerColor, setInnerColor] = useState(lightModeColor1);
  const [outerColor, setOuterColor] = useState(lightModeColor2);

  useEffect(() => {
    setInnerColor(darkMode ? darkModeColor1 : lightModeColor1);
    setOuterColor(darkMode ? darkModeColor2 : lightModeColor2);
  }, [darkMode]);

  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  const pointsInner = useMemo(
    () =>
      Points({
        innerColor,
        outerColor,
        minRadius,
        maxRadius,
        depth,
        numPoints,
      }).pointsInner,
    [innerColor, outerColor]
  );

  const pointsOuter = useMemo(
    () =>
      Points({
        innerColor,
        outerColor,
        minRadius,
        maxRadius,
        depth,
        numPoints,
      }).pointsOuter,
    [innerColor, outerColor]
  );

  return (
    <group ref={ref} position={[0, -5, -33]} rotation={[-0.4, -0.1, 0]}>
      {pointsInner.map((point) => (
        <Point
          key={point.idx}
          position={[point.position[0], point.position[1], point.position[2]]}
          color={point.color}
        />
      ))}
      {pointsOuter.map((point) => (
        <Point
          key={point.idx}
          position={[point.position[0], point.position[1], point.position[2]]}
          color={point.color}
        />
      ))}
    </group>
  );
};

const Point = React.memo(
  ({
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
          emissiveIntensity={2}
          roughness={0.5}
        />
      </Sphere>
    );
  }
);

const ThreeJS = ({
  darkMode,
  isFlashingOn,
}: {
  darkMode: boolean;
  isFlashingOn: boolean;
}) => {
  return (
    <Canvas camera={{ position: [40, -10, 20], fov: 50 }}>
      <EffectComposer>
        {isFlashingOn ? (
          <>
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
              opacity={0.5}
            />
            <Scanline opacity={0.1} density={1.5} />
          </>
        ) : (
          <></>
        )}
        <Vignette offset={0.1} darkness={1.1} />
      </EffectComposer>
      <ambientLight castShadow intensity={0.4 * Math.PI} />
      <fog
        attach="fog"
        color={darkMode ? "#333333" : "#FFFFFF"}
        near={1}
        far={85}
      />
      <PointCircle darkMode={darkMode} />
    </Canvas>
  );
};

export default ThreeJS;
