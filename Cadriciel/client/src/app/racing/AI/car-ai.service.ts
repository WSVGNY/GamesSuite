import { Injectable } from "@angular/core";
import { Car } from "../car/car";

@Injectable()
export class CarAiService {

  public constructor(private car: Car) {
    car = new Car();
   }

}
