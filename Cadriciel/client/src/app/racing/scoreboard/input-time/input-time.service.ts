import { Injectable } from "@angular/core";

@Injectable()
export class InputTimeService {
    public showInput: boolean;
    public constructor() {
        this.showInput = false;
    }

}
