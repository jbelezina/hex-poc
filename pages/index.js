import ThreeApp from "../threejs/ThreeApp";
import { useEffect, useState } from "react";
import { useThree } from "../hooks/useThree";
import { CirclePicker } from "react-color";
import styles from "../styles/CirclePicker.module.css";

export default function Home() {
  //The argument for useThree is your threejs main class

  const [canvas, threeAppInstance] = useThree(ThreeApp);
  const [datGui, setDatGui] = useState();
  const [currentColor, setCurrentColor] = useState("#ff00ff");

  useEffect(() => {
    const getDatGui = async () => {
      const datGui = await import("dat.gui");
      setDatGui(datGui);
    };
    getDatGui();
  }, []);

  useEffect(() => {
    if (threeAppInstance && !threeAppInstance.datGui && datGui) {
      threeAppInstance.setupDatGui(datGui.GUI);
    }
  }, [threeAppInstance, datGui]);

  const handleChangeComplete = (color) => {
    setCurrentColor(color);
    threeAppInstance.setTaskColor(color);
  };

  return (
    <>
      <CirclePicker
        className={styles.root}
        color={currentColor}
        onChangeComplete={handleChangeComplete}
      />
      <canvas ref={canvas} />
    </>
  );
}
