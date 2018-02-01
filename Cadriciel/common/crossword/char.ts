// taken from https://stackoverflow.com/questions/42678891/typescript-character-type

export class Char {
   
    private _char: string;
    
    public constructor(char: string){
        this.setValue(char);
    }

    public getValue():string {
        return this._char;
    }

    private setValue(char: string) {
          if (char.length != 1) {
              throw new Error("Wrong length for char")
          }
          else {
            this._char = char;
          }
    }
}