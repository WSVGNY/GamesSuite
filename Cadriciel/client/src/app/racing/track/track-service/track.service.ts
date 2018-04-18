import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Track } from "../../../../../../common/racing/track";
import {
    BASE_URL,
    GET_TRACK_LIST_ERROR,
    GET_TRACK_LIST_FROM_ID_ERROR,
    NEW_TRACK_ERROR,
    PUT_TRACK_ERROR,
    DELETE_TRACK_ERROR
} from "../../constants/track.constants";

@Injectable()
export class TrackService {

    private readonly httpOptions: { headers: HttpHeaders; } = { headers: new HttpHeaders({}) };

    public constructor(private http: HttpClient) { }

    public getTrackList(): Observable<Track[]> {
        return this.http.get<Track[]>(BASE_URL).pipe(
            catchError(this.handleError<Track[]>(GET_TRACK_LIST_ERROR))
        );
    }

    public getTrackFromId(id: string): Observable<Track> {
        return this.http.get<Track>(BASE_URL + "/" + id).pipe(
            catchError(this.handleError<Track>(GET_TRACK_LIST_FROM_ID_ERROR))
        );
    }

    public newTrack(trackName: string): Observable<Track> {
        const newTrack: Track = new Track(undefined);
        newTrack.name = trackName;

        return this.http.post<Track>(BASE_URL + "/new", newTrack, this.httpOptions).pipe(
            catchError(this.handleError<Track>(NEW_TRACK_ERROR))
        );
    }

    public putTrack(trackId: string, track: Track): Observable<Track> {
        return this.http.put<Track>(BASE_URL + "/put/" + trackId, track, this.httpOptions).pipe(
            catchError(this.handleError<Track>(PUT_TRACK_ERROR))
        );
    }

    public deleteTrack(trackId: string): Observable<Track[]> {
        return this.http.delete<Track[]>(BASE_URL + "/delete/" + trackId, this.httpOptions).pipe(
            catchError(this.handleError<Track[]>(DELETE_TRACK_ERROR))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
