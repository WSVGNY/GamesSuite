/* tslint:disable: no-magic-numbers */
import { TestBed, inject } from "@angular/core/testing";
import { KeyboardEventHandlerService } from "./keyboard-event-handler.service";
import { RenderService } from "../render-service/render.service";

const TEST_KEYCODE: number = 0;

describe("KeyboardEventHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService, RenderService]
        });
    });

    it("should be created", inject([KeyboardEventHandlerService], (keyboardService: KeyboardEventHandlerService) => {
        expect(keyboardService).toBeTruthy();
    }));

    it("should bind a function to a key down", inject(
        [KeyboardEventHandlerService], async (keyBoardService: KeyboardEventHandlerService) => {
            let testnumber: number = 0;
            keyBoardService.bindFunctionToKeyDown(TEST_KEYCODE, () => testnumber = 5);
            expect(keyBoardService["_keyDownFunctions"]
                .get(0)
                .find((value: () => void, index: number) => index === 0))
                .toEqual(() => testnumber = 5);
        })
    );

    it("should bind a function to a key up", inject(
        [KeyboardEventHandlerService], async (keyBoardService: KeyboardEventHandlerService) => {
            let testnumber: number = 0;
            keyBoardService.bindFunctionToKeyUp(TEST_KEYCODE, () => testnumber = 5);
            expect(keyBoardService["_keyUpFunctions"]
                .get(0)
                .find((value: () => void, index: number) => index === 0))
                .toEqual(() => testnumber = 5);
        })
    );

    it("should execute a function on key down", inject(
        [KeyboardEventHandlerService], async (keyBoardService: KeyboardEventHandlerService) => {
            const testnumber: number = 0;
            keyBoardService.handleKeyDown(TEST_KEYCODE);
            expect(testnumber).toEqual(5);
        })
    );

    it("should execute a function on key up", inject(
        [KeyboardEventHandlerService], async (keyBoardService: KeyboardEventHandlerService) => {
            const testnumber: number = 0;
            keyBoardService.handleKeyUp(TEST_KEYCODE);
            expect(testnumber).toEqual(5);
        })
    );
});
