import { Vec2 } from "./vec2";
import { Word } from "./word";

export class GridBox {

	private value: string;
	private word: Word;

  public constructor(private id: Vec2, private black: boolean) {
	};
	
	public get $word(): Word {
		return this.word;
	}

	public set $word(value: Word) {
		this.word = value;
	}

	public get $value(): string {
		return this.value;
	}

	public set $value(value: string) {
		this.value = value;
	}

  public get $id(): Vec2 {
		return this.id;
	}

	public get $black(): boolean {
		return this.black;
  }
  
  public set $black(black: boolean){
    this.black = black;
  }


}