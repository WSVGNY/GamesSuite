export class ResponseWordFromAPI {
    private word: string;
    private definition: string;

	public get $word(): string {
		return this.word;
	}

	public set $word(value: string) {
		this.word = value;
	}

	public get $definition(): string {
		return this.definition;
	}

	public set $definition(value: string) {
		this.definition = value;
    }
    
    public constructor() {
        this.word = "";
        this.definition = "";
    }
}