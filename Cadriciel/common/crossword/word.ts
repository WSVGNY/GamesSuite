import { Vec2 } from "./vec2";

export class Word {


	public get $id(): number {
		return this.id;
	}

	public get $definitionID(): number {
		return this.definitionID;
	}

	public set $definitionID(value: number) {
		this.definitionID = value;
	}

	public get $horizontal(): boolean {
		return this.horizontal;
	}

	public set $horizontal(value: boolean) {
		this.horizontal = value;
	}

	public get $length(): number {
		return this.length;
	}

	public set $length(value: number) {
		this.length = value;
	}

	public get $word(): string {
		return this.word;
	}

	public set $word(value: string) {
		this.word = value;
    }
    
    public get $startPos(): Vec2 {
		return this.startPos;
	}

	public set $startPos(value: Vec2) {
        this.startPos.$x = value.$x;
        this.startPos.$y = value.$x;
	}

    public constructor(
        private id: number,
        private definitionID: number,
        private horizontal: boolean,
        private length: number,
        private startPos: Vec2,
        private word: string) {
    };
}