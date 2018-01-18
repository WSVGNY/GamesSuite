import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Piste } from "../../../../../common/pistes/piste";

@Injectable()
export class PistesService {

  private readonly BASE_URL: string = "http://localhost:3000/admin";
  public constructor(private http: HttpClient) { }
  
  public listePisteGet(): Observable<Piste[]> {
    return this.http.get<Piste[]>(this.BASE_URL).pipe(
        catchError(this.handleError<Piste[]>("listePisteGet"))
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

      return (error: Error): Observable<T> => {
          return of(result as T);
      };
  }
}
