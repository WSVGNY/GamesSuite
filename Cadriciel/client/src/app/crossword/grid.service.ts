import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import {GridBox} from "../../../../common/crossword/gridBox";

@Injectable()
export class GridService {

  private readonly BASE_URL: string = "http://localhost:3000/grid/gridGet";
  public constructor(private http: HttpClient) { }

  public gridGet(): Observable<GridBox[][]> {

    return this.http.get<GridBox[][]>(this.BASE_URL).pipe(
      catchError(this.handleError<GridBox[][]>("gridGet"))
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
