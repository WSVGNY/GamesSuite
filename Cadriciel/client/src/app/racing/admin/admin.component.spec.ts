import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminComponent } from "./admin.component";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("AdminComponent", () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        }).compileComponents();
        await component["getTracksFromServer"];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should get tracks", async () => {
        expect(component["tracks"].length).toBeGreaterThan(0);
    });

    it("should create a new track", async () => {
        const oldLength: number = component["tracks"].length;
        await component.newTrack("test track");
        expect(component["tracks"].length).toEqual(oldLength + 1);
    });

    it("should delete tracks", async () => {
        const id: number = component["tracks"].length - 1;
        const oldLength: number = component["tracks"].length;
        await component.deleteTrack(id);
        expect(component["tracks"].length).toEqual(oldLength - 1);
    });
});
