// tslint:disable:no-magic-numbers
import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { ConstraintValidator } from "./constraintValidator";
import { WHITE } from "../../constants/color.constants";
import { PI_OVER_2 } from "../../constants/math.constants";
import { HALF_TRACK_WIDTH, WALL_DISTANCE_TO_TRACK, WALL_WIDTH } from "../../constants/scene.constants";

const LINE_GEOMETRY1: Geometry = new Geometry();
LINE_GEOMETRY1.vertices.push(new Vector3(0, 0, 0));
LINE_GEOMETRY1.vertices.push(new Vector3(100, 100, 0));

const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });

describe("Constraints Validator", () => {

    it("Angle should ne NAN on not connected lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const angle: number = ConstraintValidator["calculateAngle"](line, line);
        expect(angle).toBeNaN();
    });

    it("should have zero angle on overlaping lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 0, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: number = ConstraintValidator["calculateAngle"](line, line2);
        expect(angle).toEqual(0);
    });

    it("should have PI/2 angle on perpendicular lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 200, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: number = ConstraintValidator["calculateAngle"](line, line2);
        expect(angle).toEqual(PI_OVER_2);
    });

    it("should have PI angle on continuous straight lines", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(200, 200, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const angle: number = ConstraintValidator["calculateAngle"](line, line2);
        expect(angle).toEqual(Math.PI);
    });

    it("should pass angle test", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 100, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line, line2];
        expect(ConstraintValidator.checkAngle(lines, false)).toEqual(true);
    });

    it("should fail angle test", () => {
        const line: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeometry2: Geometry = new Geometry();
        lineGeometry2.vertices.push(new Vector3(100, 100, 0));
        lineGeometry2.vertices.push(new Vector3(0, 99, 0));
        const line2: Line = new Line(lineGeometry2, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line, line2];
        expect(ConstraintValidator.checkAngle(lines, false)).toEqual(false);
    });

    it("should not intersect when two lines are far appart", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(200, 200, 0));
        lineGeomerty2.vertices.push(new Vector3(300, 300, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1, line2];
        const intersectionOK: boolean = ConstraintValidator.checkIntersection(lines, false);
        expect(intersectionOK).toEqual(true);
    });

    it("should intersect when two lines are crossing", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(100, 100, 0));
        lineGeomerty2.vertices.push(new Vector3(200, 100, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const lineGeomerty3: Geometry = new Geometry();
        lineGeomerty3.vertices.push(new Vector3(200, 100, 0));
        lineGeomerty3.vertices.push(new Vector3(100, 0, 0));
        const line3: Line = new Line(lineGeomerty3, SIMPLE_LINE_MATERIAL);
        const lineGeomerty4: Geometry = new Geometry();
        lineGeomerty4.vertices.push(new Vector3(100, 0, 0));
        lineGeomerty4.vertices.push(new Vector3(0, 100, 0));
        const line4: Line = new Line(lineGeomerty4, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1, line2, line3, line4];
        const intersectionOK: boolean = ConstraintValidator.checkIntersection(lines, false);
        expect(intersectionOK).toEqual(false);
    });

    it("should intersect when second line touches on top", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(100, 100, 0));
        lineGeomerty2.vertices.push(new Vector3(100, 50, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const lineGeomerty3: Geometry = new Geometry();
        lineGeomerty3.vertices.push(new Vector3(100, 50, 0));
        lineGeomerty3.vertices.push(new Vector3(150, 50, 0));
        const line3: Line = new Line(lineGeomerty3, SIMPLE_LINE_MATERIAL);
        const lineGeomerty4: Geometry = new Geometry();
        lineGeomerty4.vertices.push(new Vector3(150, 50, 0));
        lineGeomerty4.vertices.push(new Vector3(150, 110, 0));
        const line4: Line = new Line(lineGeomerty4, SIMPLE_LINE_MATERIAL);
        const lineGeomerty5: Geometry = new Geometry();
        lineGeomerty5.vertices.push(new Vector3(150, 110, 0));
        lineGeomerty5.vertices.push(new Vector3(100, 110, 0));
        const line5: Line = new Line(lineGeomerty5, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1, line2, line3, line4, line5];
        const intersectionOK: boolean = ConstraintValidator.checkIntersection(lines, false);
        expect(intersectionOK).toEqual(false);
    });

    it("should intersect when second line touches on bottom", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(100, 100, 0));
        lineGeomerty2.vertices.push(new Vector3(100, 150, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const lineGeomerty3: Geometry = new Geometry();
        lineGeomerty3.vertices.push(new Vector3(100, 150, 0));
        lineGeomerty3.vertices.push(new Vector3(150, 150, 0));
        const line3: Line = new Line(lineGeomerty3, SIMPLE_LINE_MATERIAL);
        const lineGeomerty4: Geometry = new Geometry();
        lineGeomerty4.vertices.push(new Vector3(150, 150, 0));
        lineGeomerty4.vertices.push(new Vector3(150, 90, 0));
        const line4: Line = new Line(lineGeomerty4, SIMPLE_LINE_MATERIAL);
        const lineGeomerty5: Geometry = new Geometry();
        lineGeomerty5.vertices.push(new Vector3(150, 90, 0));
        lineGeomerty5.vertices.push(new Vector3(90, 90, 0));
        const line5: Line = new Line(lineGeomerty5, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1, line2, line3, line4, line5];
        const intersectionOK: boolean = ConstraintValidator.checkIntersection(lines, false);
        expect(intersectionOK).toEqual(false);
    });

    it("should be long enough", () => {
        const lineGeomerty: Geometry = new Geometry();
        lineGeomerty.vertices.push(new Vector3(0, 0, 0));
        lineGeomerty.vertices.push(new Vector3(0, HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK + WALL_WIDTH, 0));
        const line1: Line = new Line(lineGeomerty, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1];
        expect(ConstraintValidator.checkLength(lines)).toEqual(true);
    });

    it("should be to short", () => {
        const lineGeomerty: Geometry = new Geometry();
        lineGeomerty.vertices.push(new Vector3(0, 0, 0));
        lineGeomerty.vertices.push(new Vector3(0, HALF_TRACK_WIDTH - 1, 0));
        const line1: Line = new Line(lineGeomerty, SIMPLE_LINE_MATERIAL);
        const lines: Line[] = [line1];
        expect(ConstraintValidator.checkLength(lines)).toEqual(false);
    });
});
