export class ResponseWordFromAPI {
    private _word: string;
    private _definition: string;

	public get word(): string {
		return this._word;
	}

	public set word(value: string) {
		this._word = value;
	}

	public get definition(): string {
		return this._definition;
	}

	public set definition(value: string) {
		this._definition = value;
    }
    
    public constructor() {
        this._word = "";
        this._definition = "";
    }
}