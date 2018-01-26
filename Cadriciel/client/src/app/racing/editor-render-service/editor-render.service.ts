import { Injectable } from '@angular/core';
import { Vector2 } from "three";

@Injectable()
export class EditorRenderService {

  private mouse: THREE.Vector2;

  /*
  public get mouseCoordinates(): THREE.Vector2 {
    return this.mouse;
  }
*/
  constructor() { 
    this.mouse = new Vector2(0,0);
  }


  public handleMouseDown(event: MouseEvent): void {
    //event.preventDefault();
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
}

}
