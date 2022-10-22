import { MeshBasicMaterial, Mesh, MeshStandardMaterial } from "three";
import {
  CircleGeometry,
  CylinderGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Group,
} from "three";

export default class Hexagon {
  public height;
  public width;
  public outline: LineSegments;
  public hitArea: Mesh;
  public hex = new Group();
  public baseBredath = 0.5;
  public bredth = 0;

  constructor(name, public size, public color: number) {
    this.size = size;
    this.height = 2 * this.size;
    this.width = Math.sqrt(3) * this.size;
    const geo = new CylinderGeometry(
      this.size,
      this.size,
      this.baseBredath + this.bredth,
      6,
      1,
      false
    );
    geo.rotateX(Math.PI / 2);
    const mat = new MeshStandardMaterial({ color: "#F6DDCC" });
    const edges = new EdgesGeometry(geo);
    this.hitArea = new Mesh(geo, mat);
    this.hitArea.name = name;
    this.outline = new LineSegments(
      edges,
      new LineBasicMaterial({ color: "#ffffff" })
    );
    this.outline.visible = true;
    this.hex.add(this.hitArea, this.outline);
  }
}
