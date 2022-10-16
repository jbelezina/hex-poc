import ThreeApp from "../threejs/ThreeApp";
import { useEffect, useState } from "react";
import { useThree } from "../hooks/useThree";

export default function Home() {
  //The argument for useThree is your threejs main class

  const [canvas, threeAppInstance] = useThree(ThreeApp);
  const [datGui, setDatGui] = useState();

  useEffect(() => {
    const getDatGui = async () => {
      const datGui = await import("dat.gui");
      setDatGui(datGui);
    };
    getDatGui();
  }, []);

  useEffect(() => {
    if (threeAppInstance && datGui) {
      threeAppInstance.setupDatGui(datGui.GUI);
    }
  }, [threeAppInstance, datGui]);

  return (
    <>
      <div ref={canvas} style={{ height: "100vh" }} />
    </>
  );
}
