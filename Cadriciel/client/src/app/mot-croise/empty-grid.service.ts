import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Message } from "../../../../common/communication/message";

@Injectable()
export class EmptyGridService {

  private readonly BASE_URL: string = "http://localhost:3000/emptyGridGet";
  public constructor(private http: HttpClient) { }

  public emptyGridGet(): Observable<Message> {

    return this.http.get<Message>(this.BASE_URL).pipe(
      catchError(this.handleError<Message>("emptyGridGet"))
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }

}
