export class Coordinate {


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

	public equals(coordinate: Coordinate): boolean {
		return (this.x === coordinate.$x && this.y === coordinate.$y)
	}
}