// tslint:disable:no-magic-numbers
import { Angle } from "./angle";
import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { WHITE, PI_OVER_2 } from "../../constants";

const LINE_GEOMETRY1: Geometry = new Geometry();
LINE_GEOMETRY1.vertices.push(new Vector3(0, 0, 0));
LINE_GEOMETRY1.vertices.push(new Vector3(100, 100, 0));

const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });

describe("Angle", () => {
    it("should be instantiable when passing parameters", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const angle: Angle = new Angle(line, line);
        expect(angle).toBeDefined();
    });

    it("should fail on not connected lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const angle: Angle = new Angle(line, line);
        expect(angle.value).toBeNaN();
    });

    it("should have zero angle on overlaping lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 0, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: Angle = new Angle(line, line2);
        expect(angle.value).toEqual(0);
    });

    it("should have PI/2 angle on perpendicular lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 200, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: Angle = new Angle(line, line2);
        expect(angle.value).toEqual(PI_OVER_2);
    });

    it("should have PI angle on continuous straight lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(200, 200, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: Angle = new Angle(line, line2);
        expect(angle.value).toEqual(Math.PI);
    });
});
