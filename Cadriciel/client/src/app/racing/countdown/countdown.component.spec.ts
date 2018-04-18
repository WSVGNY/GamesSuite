import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CountdownComponent } from "./countdown.component";
import { CountdownService } from "./countdown.service";

describe("CountdownComponent", () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CountdownComponent],
            providers: [CountdownService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
