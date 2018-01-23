import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import {GridBox} from "../../../../common/grille/gridBox";

@Injectable()
export class EmptyGridService {

  private readonly BASE_URL: string = "http://localhost:3000/emptyGridGet";
  public constructor(private http: HttpClient) { }

  public emptyGridGet(): Observable<GridBox[][]> {

    return this.http.get<GridBox[][]>(this.BASE_URL).pipe(
      catchError(this.handleError<GridBox[][]>("emptyGridGet"))
    );
  }

  public async emptyGridCreate(): Promise<void>{
    
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }

}
