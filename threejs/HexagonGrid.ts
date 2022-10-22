import {
  Group,
  MaxEquation,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import Hexagon from "./Hexagon";

export default class HexagonGrid {
  public hexGrid = new Group();
  public redMaterial = new MeshStandardMaterial({
    color: "#A93226",
    colorWrite: true,
  });
  public taskColorMaterial = new MeshStandardMaterial({
    color: "ff00ff",
    colorWrite: true,
  });
  public neutralColorMaterial = new MeshStandardMaterial({
    color: "#F6DDCC",
    colorWrite: true,
  });

  constructor(public rows: number, public columns: number) {
    this.hexGrid.name = `hexGrid-${rows}-${columns}`;
    this.rows = rows;
    this.columns = columns;

    for (let z = 0; z <= rows; z++) {
      let rowNo = z;
      for (let x = 0; x <= columns - 1; x++) {
        const hexName = `${rowNo}-${x}`;
        const hexagon = new Hexagon(hexName, 1, 0xff00ff);
        hexagon.hex.position.y = rowNo * ((hexagon.height / 4) * 3);
        hexagon.hex.position.x -= hexagon.width * x + 1;
        if (rowNo % 2 === 0) {
          hexagon.hex.position.x += hexagon.width / 2;
        }
        this.hexGrid.add(hexagon.hex);
      }
      rowNo++;
    }
  }

  increment(uuid: string) {
    const hex = this.hexGrid.children.filter((c) => c.uuid === uuid);
    const mesh = hex[0].children[0] as Mesh;

    if (!mesh.userData.occupied) {
      mesh.material.copy(this.taskColorMaterial);
      mesh.userData.occupied = true;
      return;
    }

    if (mesh.userData.occupied && mesh.scale.z < 10) {
      mesh.scale.z += 1;
      mesh.position.z += 0.25;
      mesh.material.copy(this.taskColorMaterial);
    }
  }

  decrement(uuid: string) {
    const hex = this.hexGrid.children.filter((c) => c.uuid === uuid);
    const mesh = hex[0].children[0];
    if (mesh.scale.z >= 2) {
      mesh.scale.z -= 1;
      mesh.position.z -= 0.25;
      return;
    }
    if (mesh.scale.z === 1 && mesh.userData.occupied === true) {
      mesh.userData.occupied = false;
    }
    if (mesh.scale.z === 1 && mesh.userData.occupied === false) {
      mesh.material.copy(this.neutralColorMaterial);
    }
  }

  setTaskColor(color: string) {
    this.taskColorMaterial = new MeshStandardMaterial({
      color: color,
      colorWrite: true,
    });
  }
}
