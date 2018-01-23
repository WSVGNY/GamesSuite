import { Vec2 } from "./vec2";

export class Word {

    public constructor(
        private id: number,
        private definitionID: number,
        private horizontal: boolean,
        private length: number,
        private startPos: Vec2,
        private word: string) {
    };
}