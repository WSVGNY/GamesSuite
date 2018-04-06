import { Plane, Vector3 } from "three";

export class WallPlane extends Plane {
    private wallLimits: Vector3[];

    public constructor(pointLimits: Vector3[]) {
        super();
        this.wallLimits = pointLimits;
        this.findNormalVector();
        this.findConstant();
    }

    private findConstant(): void {
        this.constant = this.wallLimits[0].x * this.normal.x + this.wallLimits[0].y * this.normal.y + this.wallLimits[0].z * this.normal.z;
    }

    private findNormalVector(): void {
        const vectorAB: Vector3 = this.wallLimits[1].clone().sub(this.wallLimits[0]);
        const vectorAC: Vector3 = this.wallLimits[2].clone().sub(this.wallLimits[0]);
        this.normal = vectorAB.cross(vectorAC);
    }
}
