export class Vec2 {


	public get $x(): number {
		return this.x;
	}

	public set $x(value: number) {
		this.x = value;
	}

	public get $y(): number {
		return this.y;
	}

	public set $y(value: number) {
		this.y = value;
	}

	public constructor(private x: number, private y: number) {

	}

	public equals(vec2: Vec2): boolean {
		return (this.x === vec2.$x && this.y === vec2.$y)
	}
}