import ThreeApp from "../threejs/ThreeApp";
import { useEffect, useState } from "react";
import { useThree } from "../hooks/useThree";
import { CirclePicker } from "react-color";
import styles from "../styles/CirclePicker.module.css";
import { useQuery, useMutation } from "../convex/_generated/react";

export default function Home() {
  const board = useQuery("getBoard") ?? [];
  const setHex = useMutation("setHex");
  const [canvas, threeApp] = useThree(ThreeApp);
  const [currentColor, setCurrentColor] = useState("#ff00ff");

  const handleChangeComplete = (color) => {
    setCurrentColor(color);
    threeApp.setTaskColor(color);
  };

  useEffect(() => {
    if (threeApp) {
      threeApp.setSetHex(setHex);
    }
  }, [setHex, threeApp]);

  useEffect(() => {
    if (threeApp) {
      threeApp.setBoard(board);
    }
  }, [board, threeApp]);

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
