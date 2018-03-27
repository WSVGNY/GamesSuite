// tslint:disable:no-magic-numbers

import { PreviewScene } from "./previewScene";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Track } from "../../../../../common/racing/track";

describe("Preview Scene", () => {

    let previewScene: PreviewScene;

    beforeEach(() => {
        previewScene = new PreviewScene();
    });

    it("should be created", () => {
        expect(previewScene).toBeTruthy();
    });

    it("should add the desired track to the preview", () => {
        const MOCK_TRACK: CommonCoordinate3D[] = [
            new CommonCoordinate3D(0, 0, 0),
            new CommonCoordinate3D(100, 0, 0),
            new CommonCoordinate3D(100, 0, 100),
            new CommonCoordinate3D(0, 0, 100),
        ];
        const mockTrack: Track = new Track("");
        mockTrack.vertices = MOCK_TRACK;
        previewScene.loadTrack(mockTrack);
        expect(previewScene.getChildByName("track")).toBeDefined();
    });
});
