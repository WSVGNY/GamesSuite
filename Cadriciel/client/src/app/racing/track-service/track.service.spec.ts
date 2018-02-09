import { TestBed, inject } from "@angular/core/testing";
import { TrackService } from "./track.service";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { Track } from "../../../../../common/racing/track";

describe("TrackService", () => {
    let originalTimeout: number;
    const TIMEOUT: number = 10000;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TrackService,
                { provide: APP_BASE_HREF, useValue: "/" }
            ],
            imports: [AppModule]
        });
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it("should be created", inject([TrackService], (service: TrackService) => {
        expect(service).toBeTruthy();
    }));

    it("should get track list", inject([TrackService], (service: TrackService, done: DoneFn) => {

        service.getTrackList()
            .subscribe((tracksFromServer: Track[]) => {
                const tracks: Track[] = tracksFromServer;
                expect(tracks.length).toBeGreaterThan(0);
                done();
            });
    }));

    it("should get track from id", inject([TrackService], (service: TrackService, done: DoneFn) => {
        service.getTrackFromId(1)
            .subscribe((trackFromServer: Track) => {
                const track: Track = new Track(trackFromServer["id"], trackFromServer["name"]);
                expect(track.$id).toEqual(1);
                done();
            });
    }));

    it("should create a new track", inject([TrackService], (service: TrackService, done: DoneFn) => {
        service.getTrackList()
            .subscribe((tracksFromServer: Track[]) => {
                const tracks: Track[] = tracksFromServer;
                service.newTrack("Test Track")
                    .subscribe((newTrackFromServer: Track[]) => {
                        expect(tracks.length).toBeLessThan(newTrackFromServer.length);
                        done();
                    });
            });
    }));

    it("should edit a track ", inject([TrackService], (service: TrackService, done: DoneFn) => {
        service.getTrackList()
            .subscribe((tracksFromServer: Track[]) => {
                const tracks: Track[] = tracksFromServer;
                service.putTrack(new Track(tracks[tracks.length - 1]["id"], "New name"))
                    .subscribe((editedTrack: Track) => {
                        const track: Track = new Track(editedTrack["id"], editedTrack["name"]);
                        expect(track.$name).toEqual("New name");
                        done();
                    });
            });
    }));

    it("should delete tracks", inject([TrackService], (service: TrackService, done: DoneFn) => {
        service.getTrackList()
            .subscribe((tracksFromServer: Track[]) => {
                const tracks: Track[] = tracksFromServer;
                service.deleteTrack(tracks.length)
                    .subscribe((newTrackFromServer: Track[]) => {
                        expect(tracks.length).toBeGreaterThan(newTrackFromServer.length);
                        done();
                    });
            });
    }));
});
