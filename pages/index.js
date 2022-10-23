import ThreeApp from "../threejs/ThreeApp";
import { useState } from "react";
import { useThree } from "../hooks/useThree";
import { CirclePicker } from "react-color";
import styles from "../styles/CirclePicker.module.css";

export default function Home() {
  const [canvas, threeApp] = useThree(ThreeApp);
  const [currentColor, setCurrentColor] = useState("#ff00ff");

  const handleChangeComplete = (color) => {
    setCurrentColor(color);
    threeApp.setTaskColor(color);
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
