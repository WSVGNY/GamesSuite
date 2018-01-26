import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Track } from "../../../../../common/racing/track";

@Injectable()
export class PistesService {

  private readonly BASE_URL: string = "http://localhost:3000/admin";
  public constructor(private http: HttpClient) { }
  
  public getListePiste(): Observable<Track[]> {
    return this.http.get<Track[]>(this.BASE_URL).pipe(
        catchError(this.handleError<Track[]>("getListePiste"))
    );
  }

  public getPisteParID(id: Number): Observable<Track> {
    return this.http.get<Track>(this.BASE_URL + "/" + id).pipe(
        catchError(this.handleError<Track>("getPisteParID"))
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

      return (error: Error): Observable<T> => {
          return of(result as T);
      };
  }
}
