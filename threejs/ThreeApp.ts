import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import HexagonGrid from "./HexagonGrid";

export default class ThreeApp {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public width: number;
  public height: number;
  public gui: any = null;
  public controls: OrbitControls;
  public raycaster = new THREE.Raycaster();
  public canvas;
  public intersects = [];
  public hexGrid;

  constructor(canvas: HTMLCanvasElement, public mouse = new THREE.Vector2()) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.setupRenderer(canvas);
    this.setupCamera();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    this.resize();

    this.setupResize();
    this.setupLight();
    this.render();
    window.addEventListener("mousemove", this.setMouseCoordinates.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("contextmenu", this.handleRightClick.bind(this));
  }

  handleRightClick(e) {
    const intersects = this.checkPointerIntersects();
    if (!intersects.length) {
      return;
    }
    const meshes = intersects.filter((i) => i.object.type === "Mesh");
    if (!meshes.length) {
      return;
    }

    this.hexGrid.decrement(meshes[0].object.parent.uuid);
  }

  handleClick(e) {
    const intersects = this.checkPointerIntersects();
    if (!intersects.length) {
      return;
    }
    const meshes = intersects.filter((i) => i.object.type === "Mesh");
    if (!meshes.length) {
      return;
    }

    this.hexGrid.increment(meshes[0].object.parent.uuid);
  }

  checkPointerIntersects() {
    if (!this.mouse) return [];

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    return intersects.length ? intersects : [];
  }

  setMouseCoordinates(event) {
    if (!this.mouse) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.mouse.x = (x / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = (y / this.canvas.clientHeight) * -2 + 1;
  }

  setupLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 1000, 100);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this.scene.add(spotLight);
  }

  setupRenderer(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
  }

  setupCamera() {
    if (typeof window !== "undefined") {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.width / this.height,
        0.001,
        1000
      );
      this.camera.position.set(0, -15, 10);
    }
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    const hexGrid = new HexagonGrid(20, 20);
    this.hexGrid = hexGrid;
    this.hexGrid.hexGrid.position.x += 15;
    this.hexGrid.hexGrid.position.y -= 5;
    this.scene.add(hexGrid.hexGrid);
  }

  setTaskColor(color) {
    this.hexGrid.setTaskColor(color.hex);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
