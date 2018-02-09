import { Vec2 } from "./vec2";

export class Word {

	private value: string;
	private definition: string;
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

	public get $value(): string {
		return this.value;
	}

	public set $value(value: string) {
		this.value = value;
	}

	public get $startPosition(): Vec2 {
		return this.startPosition;
	}

	public set $startPosition(value: Vec2) {
		this.startPosition.$x = value.$x;
		this.startPosition.$y = value.$x;
	}

	public get $definition(): string {
		return this.definition;
	}

	public set $definition(value: string) {
		this.definition = value;
	}

	public constructor(
		private id: number,
		private definitionID: number,
		private horizontal: boolean,
		private length: number,
		private startPosition: Vec2) {
	};

	public resetValue(): void {
		this.value="";
		for (let i: number = 0; i < this.length; i++) {
			this.value+="?";
		}
	}
}