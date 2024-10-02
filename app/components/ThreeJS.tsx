import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const CurvedThing = () => {
  const { scene } = useLoader(GLTFLoader, "/curvedthing.glb");
  return (
    <primitive
      position={[3.5, 0.5, -1]}
      rotation={[45.1, 0.5, -44.7]}
      object={scene}
    />
  );
};

const ThreeJS = () => {
  return (
    <Canvas camera={{ position: [4, 4, 7], fov: 44 }}>
      <CurvedThing />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
    </Canvas>
  );
};

export default ThreeJS;
