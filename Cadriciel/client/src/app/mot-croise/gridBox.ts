export class GridBox {
  id: number;
  value: string;
  black: boolean;
  public constructor(id: number, black: boolean) {
    this.id = id;
    this.black = black;
  };
}