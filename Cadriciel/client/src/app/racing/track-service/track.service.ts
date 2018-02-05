import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Track } from "../../../../../common/racing/track";

@Injectable()
export class TrackService {

    private readonly BASE_URL: string = "http://localhost:3000/admin";
    private readonly httpOptions: { headers: HttpHeaders; } = {
        headers: new HttpHeaders({
        })
    };

    public constructor(private http: HttpClient) { }

    public getTrackList(): Observable<Track[]> {
        return this.http.get<Track[]>(this.BASE_URL).pipe(
            catchError(this.handleError<Track[]>("getListePiste"))
        );
    }

    public getTrackFromId(id: Number): Observable<Track> {
        return this.http.get<Track>(this.BASE_URL + "/" + id).pipe(
            catchError(this.handleError<Track>("getPisteParID"))
        );
    }

    public newTrack(trackName: string): Observable<Track> {
        return this.http.post<Track>(this.BASE_URL + "/new/" + trackName, this.httpOptions).pipe(
            catchError(this.handleError<Track>("newTrack"))
        );
    }

    public deleteTrack(trackId: number): Observable<Track[]> {
        return this.http.delete<Track[]>(this.BASE_URL + "/delete/" + trackId, this.httpOptions).pipe(
            catchError(this.handleError<Track[]>("deleteTrack"))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
