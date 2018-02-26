import assert = require("assert");
import * as requestPromise from "request-promise-native";
import { TrackDocument, TrackMapElement, Track } from "../../../common/racing/track";
import { TrackType } from "../../../common/racing/trackType";

const SERVICE_BASE_URL: string = "http://localhost:3000/track/";
describe("TRACK SERVICE TESTS", () => {

    it("should get a list of tracks", (done: MochaDone) => {
        const tracks: TrackMapElement[] = new Array();
        requestPromise(SERVICE_BASE_URL).then((response: string) => {
            for (const document of JSON.parse(JSON.parse(response)) as string[]) {
                const iTrack: TrackDocument = JSON.parse(JSON.stringify(document));
                if (iTrack.track._isTestTrack === true) {
                    assert(false);
                    done();
                }
                tracks.push({
                    "key": iTrack._id,
                    "value": new Track(iTrack)
                });
            }
            assert(tracks.length !== 0);
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    it("should get a single track", (done: MochaDone) => {
        requestPromise(SERVICE_BASE_URL + "/5a933c16883f6e3d48ec81fe").then((response: string) => {
            const iTrack: TrackDocument = JSON.parse(response);
            assert(iTrack._id === "5a933c16883f6e3d48ec81fe");
            assert(iTrack.track._isTestTrack === true);
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    it("should edit a track", (done: MochaDone) => {
        const randomNumber: number = Math.random();
        const options: requestPromise.OptionsWithUrl = {
            method: "PUT",
            url: SERVICE_BASE_URL + "/put/5a933c16883f6e3d48ec81fe",
            body: {
                "name": randomNumber.toString(),
                "_isTestTrack": true,
                "description": "nothing to be afraid of",
                "vertices": [
                    { x: 0, y: 0, z: 50 },
                    { x: 50, y: 0, z: 0 },
                    { x: 0, y: 0, z: -50 },
                    { x: -50, y: 0, z: 0 },
                ],
                "type": TrackType.Default
            },
            json: true
        };
        requestPromise(options).then((response: string) => {
            const iTrack: TrackDocument = JSON.parse(JSON.stringify(response));
            assert(iTrack._id === "5a933c16883f6e3d48ec81fe");
            assert(iTrack.track.name === randomNumber.toString());
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    // tslint:disable-next-line:max-func-body-length
    it.only("should create a new track", (done: MochaDone) => {
        let newTrackIdToDelete: string = "5a1111111111111111111111";
        const options: requestPromise.OptionsWithUrl = {
            method: "PUT",
            url: SERVICE_BASE_URL + "/new",
            body: {
                "_id": newTrackIdToDelete,
                "track": {
                    "name": "New Test Track",
                    "_isTestTrack": false,
                    "description": "",
                    "vertices": [
                        { x: 0, y: 0, z: 50 },
                        { x: 50, y: 0, z: 0 },
                        { x: 0, y: 0, z: -50 },
                        { x: -50, y: 0, z: 0 },
                    ],
                    "type": TrackType.Default
                }
            },
            json: true
        };
        requestPromise(options).then((response: string) => {
            const iTrack: TrackDocument = JSON.parse(JSON.stringify(response));
            assert(newTrackIdToDelete === iTrack._id);
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });
});
