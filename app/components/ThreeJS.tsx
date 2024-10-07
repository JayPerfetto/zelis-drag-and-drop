import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { Points } from "~/utils/three";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { Group } from "three";
import { BlendFunction } from "postprocessing";
import { useEffect, useState } from "react";
import React from "react";

// Colors and settings for the points
const darkModeColor1 = "FFFFFF"; // white
const darkModeColor2 = "BB86FC"; // purple
const lightModeColor1 = "222222"; // dark gray
const lightModeColor2 = "419bf9"; // light blue
const minRadius = 7.5;
const maxRadius = 15;
const depth = 2;
const numPoints = 1250;

// PointCircle component to render the points
const PointCircle = ({ darkMode }: { darkMode: boolean }) => {
  const [innerColor, setInnerColor] = useState(lightModeColor1);
  const [outerColor, setOuterColor] = useState(lightModeColor2);

  // Effect to set the colors based on the darkMode state
  useEffect(() => {
    setInnerColor(darkMode ? darkModeColor1 : lightModeColor1);
    setOuterColor(darkMode ? darkModeColor2 : lightModeColor2);
  }, [darkMode]);

  const ref = useRef<Group>(null);

  // Effect to rotate the points
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  // Memoized points for the inner and outer circles
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

  // Render the points
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

// Point component to render an individual point
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
          emissiveIntensity={1.5}
          roughness={0.5}
        />
      </Sphere>
    );
  }
);

// ThreeJS component to render the 3D effect
const ThreeJS = ({
  darkMode,
  isFlashingOn,
}: {
  darkMode: boolean;
  isFlashingOn: boolean;
}) => {
  return (
    <Canvas camera={{ position: [40, -10, 20], fov: 50 }}>
      {/* EffectComposer to apply post-processing effects */}
      <EffectComposer>
        {/* If flashing is on, apply the depth of field, bloom, and scanline effects */}
        {isFlashingOn ? (
          <>
            <DepthOfField
              focusDistance={0}
              focalLength={0.01}
              bokehScale={0.15}
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
      {/* Ambient light to provide a base lighting effect */}
      <ambientLight castShadow intensity={0.4 * Math.PI} />
      {/* Fog to create a depth effect in the scene */}
      <fog
        attach="fog"
        color={darkMode ? "#333333" : "#FFFFFF"}
        near={1}
        far={85}
      />
      {/* PointCircle component to render the points */}
      <PointCircle darkMode={darkMode} />
    </Canvas>
  );
};

export default ThreeJS;
