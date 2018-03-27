import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChooseTrackComponent } from "./choose-track.component";
import { TrackService } from "../track-service/track.service";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { RenderService } from "../render-service/render.service";
import { Track } from "../../../../../common/racing/track";

describe("ChooseTrackComponent", () => {
    let component: ChooseTrackComponent;
    let fixture: ComponentFixture<ChooseTrackComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [ChooseTrackComponent],
            imports: [
                RouterModule,
                HttpClientModule
            ],
            providers: [TrackService, RenderService]
        })
            .compileComponents().catch((error: Error) => console.error(error));
        component["getTracksFromServer"]();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChooseTrackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("track should have a name", () => {
        component.tracks.forEach((track: Track) => expect(track.name).toBeDefined());
    });

    it("track should have the number of times played", () => {
        component.tracks.forEach((track: Track) => expect(track.timesPlayed).toBeDefined());
    });

    it("track should have a description", () => {
        component.tracks.forEach((track: Track) => expect(track.description).toBeDefined());
    });

    it("track should have best times", () => {
        component.tracks.forEach((track: Track) => expect(track.bestTimes).toBeDefined());
    });

    it("track should have verticies", () => {
        component.tracks.forEach((track: Track) => expect(track.vertices).toBeDefined());
    });

    it("track should have a type", () => {
        component.tracks.forEach((track: Track) => expect(track.type).toBeDefined());
    });
});
