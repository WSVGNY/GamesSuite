// tslint:disable:no-magic-numbers
import { Intersection } from "./intersection";
import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { WHITE } from "../../constants";

const LINE_GEOMETRY1: Geometry = new Geometry();
LINE_GEOMETRY1.vertices.push(new Vector3(0, 0, 0));
LINE_GEOMETRY1.vertices.push(new Vector3(100, 100, 0));

const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });

describe("Intersection", () => {
    it("should be instantiable when passing parameters", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const intersection: Intersection = new Intersection(line1, line1, 50);
        expect(intersection).toBeDefined();
    });

    it("should not intersect when two lines are far appart", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(200, 200, 0));
        lineGeomerty2.vertices.push(new Vector3(300, 300, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const intersection: Intersection = new Intersection(line1, line2, 50);
        expect(intersection.isIntersecting).toEqual(false);
    });

    it("should intersect when two lines are crossing", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(0, 100, 0));
        lineGeomerty2.vertices.push(new Vector3(100, 0, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const intersection: Intersection = new Intersection(line1, line2, 50);
        expect(intersection.isIntersecting).toEqual(true);
    });

    it("should intersect when second line touches on top", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(0, 100, 0));
        lineGeomerty2.vertices.push(new Vector3(105, 110, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const intersection: Intersection = new Intersection(line1, line2, 50);
        expect(intersection.isIntersecting).toEqual(true);
    });

    it("should intersect when second line touches on bottom", () => {
        const line1: Line = new Line(LINE_GEOMETRY1, SIMPLE_LINE_MATERIAL);
        const lineGeomerty2: Geometry = new Geometry();
        lineGeomerty2.vertices.push(new Vector3(100, 0, 0));
        lineGeomerty2.vertices.push(new Vector3(105, 90, 0));
        const line2: Line = new Line(lineGeomerty2, SIMPLE_LINE_MATERIAL);
        const intersection: Intersection = new Intersection(line1, line2, 50);
        expect(intersection.isIntersecting).toEqual(true);
    });

});
