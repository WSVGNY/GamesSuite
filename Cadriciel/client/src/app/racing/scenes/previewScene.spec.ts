// tslint:disable:no-magic-numbers

import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { PreviewScene } from "./previewScene";

describe("Preview Scene", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (renderService: RenderService) => {
        const previewScene: PreviewScene = new PreviewScene();
        expect(previewScene).toBeTruthy();
    }));
});
