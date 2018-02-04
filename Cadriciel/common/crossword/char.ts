// taken from https://stackoverflow.com/questions/42678891/typescript-character-type

export class Char {
   
    private value: string;
    
    public constructor(char: string){
        this.$value = char;
    }

    public get $value():string {
        return this.value;
    }

    public set $value(char: string) {
          if (char.length != 1) {
              throw new Error("Wrong length for char")
          }
          else {
            this.value = char;
          }
    }
}