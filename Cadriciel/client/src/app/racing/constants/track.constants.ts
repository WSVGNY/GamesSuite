import { SERVER_URL } from "../../../../../common/constants";

export const BASE_URL: string = SERVER_URL + "/track";
export const GET_TRACK_LIST_ERROR: string = "getTrackList";
export const GET_TRACK_LIST_FROM_ID_ERROR: string = "getTrackFromId";
export const NEW_TRACK_ERROR: string = "newTrack";
export const PUT_TRACK_ERROR: string = "putTrack";
export const DELETE_TRACK_ERROR: string = "getTrackList";
export const FINISH_LINE_DETECTION_BUFFER: number = 3;
// wall
export const SLOW_DOWN_FACTOR: number = 0.985;
export const ROTATION_FACTOR: number = 0.001;
export const HEIGHT: number = 0.5;
export const EXTRUDE_SETTINGS: Object = {
    steps: 1,
    amount: -HEIGHT,
    bevelEnabled: false
};
