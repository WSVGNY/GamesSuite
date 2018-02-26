// tslint:disable:no-magic-numbers

import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "../render-service/render.service";
import { TrackPreview } from "./trackPreview";
import { ITrack, Track } from "../../../../../common/racing/track";

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
        const mockTrack: Track = new Track(TrackStructure);
        // // TRACK 4
        // new Vector3(-48, 0, -27),
        // new Vector3(-55, 0, 17),
        // new Vector3(9, 0, 34),
        // new Vector3(74, 0, 7),
        // new Vector3(70, 0, -26)
        trackPreview.loadTrack();
    }));
});
