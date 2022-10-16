import { useEffect, useRef, useState } from "react";
import ThreeApp from "../threejs/ThreeApp";

export const useThree = (ThreeClass: typeof ThreeApp) => {
  const [instance, setInstance] = useState<ThreeApp>();
  const canvas = useRef(null);

  useEffect(() => {
    const newInstance = new ThreeClass(canvas.current);
    setInstance(newInstance);
  }, []);

  return [canvas, instance];
};
