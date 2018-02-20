import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
// import { Object3D } from "three";
import assert = require("assert");

describe("RenderService", () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("camera should be a child of _playerCar", inject([RenderService], (done: () => void) => {
        assert(false);
    }));
});
