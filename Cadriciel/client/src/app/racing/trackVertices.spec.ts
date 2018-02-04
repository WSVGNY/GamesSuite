import { TestBed, inject } from "@angular/core/testing";
import { TrackVertices } from "./trackVertices";
import { Scene, Vector3 } from "three";

describe("TrackVertices", () => {
    let scene: Scene;
    let trackVerticies: TrackVertices;

    beforeEach(() => {
        scene = new Scene();
        trackVerticies = new TrackVertices(scene);
    });

    it("should cerate a point in the scene", ()  => {
        trackVerticies.addVertex(new Vector3( 0, 0, 0 ));
        expect(scene.getChildByName("vertex0") === null).toBeFalsy();
    });

    it("should create a connection between two points", ()  => {
        trackVerticies.addVertex(new Vector3( 0, 0, 0 ));
        trackVerticies.addVertex(new Vector3( 1, 1, 0 ));
        expect(scene.getChildByName("connection1").name === null).toBeFalsy();
    });

    /*it("should remove a point from the list of points and the connection assiciated this it", () => {
        trackVerticies.removeLastVertex();
        result = scene.getChildByName("vertex1").name === "vertex1" || scene.getChildByName("connection1").name === "connexion1" ;
        expect(result).toBeFalsy();
    });

    it("should  a second and a third point plus the connextion between them", () => {
        trackVerticies.addVertex(vector2);
        trackVerticies.addVertex(vector3);
        result = scene.getChildByName("vertex1").name === "vertex1"
        && scene.getChildByName("vertex2").name === "vertex2"
        && scene.getChildByName("connection1").name === "connexion1"
        && scene.getChildByName("connection2").name === "connexion2";
        expect(result).toBeTruthy();
    });

    it("should  loop the track when we add a point on the start Point ", () => {
        trackVerticies.addVertex(vector1);
        result = listOfPoints.$isComplete();
        expect(result).toBeTruthy();
    });*/
});
