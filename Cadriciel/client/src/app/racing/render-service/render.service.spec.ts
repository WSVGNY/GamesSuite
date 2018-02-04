import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { ElementRef } from "@angular/core/src/linker/element_ref";
import { Object3D } from "three";
import { Car} from "./../car/car";

describe("RenderService", () => {
    let render: RenderService;
    beforeEach(async (done: () => void) => {

        TestBed.configureTestingModule({
            providers: [RenderService]
        });


        render = new RenderService;

        //await render.initialize();
        done();
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("camera should be a child of _car", inject([RenderService], (service: RenderService) => {

        //const cam: Object3D = service.car.getChild("PLAYER_CAMERA");
        //expect(cam).toBeDefined();
    });
});
