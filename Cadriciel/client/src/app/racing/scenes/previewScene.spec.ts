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

    // it("should add the desired track to the preview", inject([RenderService], (renderService: RenderService) => {
    //     const trackPreview: TrackPreview = new TrackPreview(renderService);
    //     const mockTrack: Track = new Track(TrackStructure.getNewDefaultTrackStructure());
    //     trackPreview.loadTrack(mockTrack);
    //     expect(renderService["_scene"].getChildByName("track")).toBeDefined();
    // }));
});
