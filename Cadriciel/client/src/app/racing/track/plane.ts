import { Plane, Vector3 } from "three";

export class WallPlane extends Plane {
    private wallLimits: Vector3[];

    public constructor(currentPoint: Vector3, nextPoint: Vector3, aboveCurrentPoint: Vector3) {
        super();
        this.wallLimits = [];
        this.wallLimits.push(currentPoint);
        this.wallLimits.push(nextPoint);
        this.wallLimits.push(aboveCurrentPoint);
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
        this.normal.normalize();
    }

    public isPointBetweenWallLimits(point: Vector3): boolean {
        return point.x >= Math.min(this.wallLimits[0].x, this.wallLimits[1].x) &&
            point.x <= Math.max(this.wallLimits[0].x, this.wallLimits[1].x) &&
            point.z >= Math.min(this.wallLimits[0].z, this.wallLimits[1].z) &&
            point.z <= Math.max(this.wallLimits[0].z, this.wallLimits[1].z);
    }
}
