import { Injectable } from "@angular/core";

@Injectable()
export class InputNameService {
    public showInput: boolean;
    public constructor() {
        this.showInput = false;
    }

}
