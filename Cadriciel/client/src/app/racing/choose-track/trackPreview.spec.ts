// tslint:disable:no-magic-numbers

import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { TrackPreview } from "./trackPreview";
import { ITrack, Track, TrackStructure } from "../../../../../common/racing/track";

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

    it("should display the desired track", inject([RenderService], (renderService: RenderService) => {
        const trackPreview: TrackPreview = new TrackPreview(renderService);
        const mockTrack: Track = new Track(TrackStructure.getNewDefaultTrackStructure());
        trackPreview.loadTrack(mockTrack);
        expect(trackPreview["renderService"]["_scene"].getChildByName()).toBeDefined();
    }));
});
