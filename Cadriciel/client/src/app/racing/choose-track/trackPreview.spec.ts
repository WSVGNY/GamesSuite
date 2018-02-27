// tslint:disable:no-magic-numbers

import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { TrackPreview } from "./trackPreview";
import { TrackStructure } from "../../../../../common/racing/track";
import { Track } from "../track";

describe("Track Preview", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (renderService: RenderService) => {
        const trackPreview: TrackPreview = new TrackPreview(renderService);
        expect(trackPreview).toBeTruthy();
    }));

    it("should add the desired track to the preview", inject([RenderService], (renderService: RenderService) => {
        const trackPreview: TrackPreview = new TrackPreview(renderService);
        const mockTrack: Track = new Track(TrackStructure.getNewDefaultTrackStructure());
        trackPreview.loadTrack(mockTrack);
        expect(renderService["_scene"].getChildByName("track")).toBeDefined();
    }));
});
