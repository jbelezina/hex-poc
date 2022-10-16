import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface IDatGuiProps {
  progress: number;
}

export default class ThreeApp {
  scene: THREE.Scene;
  renderer: THREE.renderer;
  camera: THREE.camera;
  width: number;
  height: number;
  gui: any;
  datGuiProps: IDatGuiProps;
  controls: THREE.controls;

  constructor(public canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.setupRenderer();
    this.setupCamera();
    this.canvas.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  setupCamera() {
    if (typeof window !== "undefined") {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.width / this.height,
        0.001,
        1000
      );
      this.camera.position.set(0, 0, 2);
    }
  }

  setupDatGui(datGui) {
    this.datGuiProps = {
      progress: 0,
    };
    this.gui = new datGui();
    this.gui.add(this.datGuiProps, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {}

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
