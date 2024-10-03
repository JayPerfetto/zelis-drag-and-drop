import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text, Stage, OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { FileInfo } from "../types/types";
import { formatFileSize } from "~/utils/formatFileSize";

const Model = ({ files }: { files: FileInfo[] }) => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf"
  );

  useEffect(() => {}, [files]);

  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setRotation([
      Math.sin(t * 0.2) * 0.1,
      Math.sin(t * 0.2) * 0.1 - 0.5,
      Math.sin(t * 0.2) * 0.1,
    ]);
    setPosition(new Vector3(0, (Math.sin(t * 0.4) + 1) * 0.05, 0));
  });
  return (
    <group position={[0, position.y, 0]} rotation={rotation}>
      <primitive position={[0, 0, 0]} scale={1.2} object={scene} />
      <group position={[0.1, 1, 0.1]}>
        <Text
          position={[0.1, 0.3, 0]}
          fontSize={0.2}
          color="#353935"
          fontWeight="bold"
          anchorY="top">
          My Files
        </Text>
        {files.length === 0 ? (
          <Text
            position={[0.1, 2, 0]}
            fontSize={0.1}
            color="#353935"
            anchorY="top"
            anchorX="center"
            maxWidth={1.5}>
            Upload a file
          </Text>
        ) : (
          files.map((file: any, index: number) => (
            <Text
              key={index}
              position={[-0.5, -index * 0.15, 0]}
              fontSize={0.1}
              color="#353935"
              anchorY="top"
              anchorX="left"
              maxWidth={1.5}>
              {`${new Date(file.lastModified).toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
              })} - ${
                file.name.length > 10
                  ? file.name.substring(0, 10) + "..."
                  : file.name
              } (${formatFileSize(file.size)})`}
            </Text>
          ))
        )}
      </group>
    </group>
  );
};

const ThreeJS = ({ files }: { files: FileInfo[] }) => {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 30 }}>
      <Stage intensity={1} environment="city">
        <Model files={files} />
      </Stage>
      <ambientLight intensity={1.5 * Math.PI} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
};

export default ThreeJS;
