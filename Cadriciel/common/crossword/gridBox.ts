export class GridBox {

  private value: string;

  public constructor(private id: number, private black: boolean) {
  };

	public get $value(): string {
		return this.value;
	}

	public set $value(value: string) {
		this.value = value;
	}

  public get $id(): number {
		return this.id;
	}

	public get $black(): boolean {
		return this.black;
  }
  
  public set $black(black: boolean){
    this.black = black;
  }


}