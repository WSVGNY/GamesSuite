import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
import { Object3D } from "three";

describe("RenderService", () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("camera should be a child of _car", inject([RenderService], (done: () => void) => {
        let render: RenderService;
        render = new RenderService();
        render.initialize(undefined).then(() => {
            const cam: Object3D = render.car.getChild("PLAYER_CAMERA");
            expect(cam).toBeDefined();
            done();
        }).catch(done);
    }));
});
