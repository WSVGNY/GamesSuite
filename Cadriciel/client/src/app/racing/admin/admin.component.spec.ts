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
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
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
});
