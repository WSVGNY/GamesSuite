import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { Track, TrackMap } from "../../../../../common/racing/track";

@Injectable()
export class TrackService {

    private readonly BASE_URL: string = "http://localhost:3000/admin";
    private readonly httpOptions: { headers: HttpHeaders; } = {
        headers: new HttpHeaders({
        })
    };

    public constructor(private http: HttpClient) { }

    public getTrackList(): Observable<TrackMap> {
        return this.http.get<TrackMap>(this.BASE_URL).pipe(
            catchError(this.handleError<TrackMap>("getTrackList"))
        );
    }

    public getTrackFromId(id: string): Observable<Track> {
        return this.http.get<Track>(this.BASE_URL + "/" + id).pipe(
            catchError(this.handleError<Track>("getTrackFromId"))
        );
    }

    public newTrack(trackName: string): Observable<TrackMap> {
        return this.http.post<TrackMap>(this.BASE_URL + "/new/" + trackName, this.httpOptions).pipe(
            catchError(this.handleError<TrackMap>("newTrack"))
        );
    }

    public putTrack(trackId: string, track: Track): Observable<Track> {
        return this.http.put<Track>(this.BASE_URL + "/put/" + trackId, track, this.httpOptions).pipe(
            catchError(this.handleError<Track>("putTrack"))
        );
    }

    public deleteTrack(trackId: string): Observable<TrackMap> {
        return this.http.delete<TrackMap>(this.BASE_URL + "/delete/" + trackId, this.httpOptions).pipe(
            catchError(this.handleError<TrackMap>("deleteTrack"))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
