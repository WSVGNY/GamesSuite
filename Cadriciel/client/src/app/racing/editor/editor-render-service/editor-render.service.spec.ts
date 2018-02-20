import { TestBed, inject } from "@angular/core/testing";
import { EditorRenderService } from "./editor-render.service";

describe("EditorRenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditorRenderService]
        });
    });

    it("should be created", inject([EditorRenderService], (service: EditorRenderService) => {
        expect(service).toBeTruthy();
    }));

});
