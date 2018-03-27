import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Track } from "../../../../../common/racing/track";

@Injectable()
export class TrackService {

    private readonly BASE_URL: string = "http://localhost:3000/track";
    private readonly GET_TRACK_LIST_ERROR: string = "getTrackList";
    private readonly GET_TRACK_LIST_FROM_ID_ERROR: string = "getTrackFromId";
    private readonly NEW_TRACK_ERROR: string = "newTrack";
    private readonly PUT_TRACK_ERROR: string = "putTrack";
    private readonly DELETE_TRACK_ERROR: string = "getTrackList";
    private readonly httpOptions: { headers: HttpHeaders; } = { headers: new HttpHeaders({}) };

    public constructor(private http: HttpClient) { }

    public getTrackList(): Observable<Track[]> {
        return this.http.get<Track[]>(this.BASE_URL).pipe(
            catchError(this.handleError<Track[]>(this.GET_TRACK_LIST_ERROR))
        );
    }

    public getTrackFromId(id: string): Observable<Track> {
        return this.http.get<Track>(this.BASE_URL + "/" + id).pipe(
            catchError(this.handleError<Track>(this.GET_TRACK_LIST_FROM_ID_ERROR))
        );
    }

    public newTrack(trackName: string): Observable<Track> {
        const newTrack: Track = new Track(undefined);
        newTrack.name = trackName;

        return this.http.post<Track>(this.BASE_URL + "/new", newTrack, this.httpOptions).pipe(
            catchError(this.handleError<Track>(this.NEW_TRACK_ERROR))
        );
    }

    public putTrack(trackId: string, track: Track): Observable<Track> {
        return this.http.put<Track>(this.BASE_URL + "/put/" + trackId, track, this.httpOptions).pipe(
            catchError(this.handleError<Track>(this.PUT_TRACK_ERROR))
        );
    }

    public deleteTrack(trackId: string): Observable<Track[]> {
        return this.http.delete<Track[]>(this.BASE_URL + "/delete/" + trackId, this.httpOptions).pipe(
            catchError(this.handleError<Track[]>(this.DELETE_TRACK_ERROR))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
