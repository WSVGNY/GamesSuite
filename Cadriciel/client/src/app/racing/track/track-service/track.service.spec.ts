import { TestBed, inject } from "@angular/core/testing";
import { TrackService } from "./track.service";
import { APP_BASE_HREF } from "@angular/common";
import { AppModule } from "../../../app.module";

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

});
