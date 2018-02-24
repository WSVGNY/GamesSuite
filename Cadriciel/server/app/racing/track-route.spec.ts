import assert = require("assert");
import * as requestPromise from "request-promise-native";
import { TrackDocument, TrackMapElement, Track } from "../../../common/racing/track";

const SERVICE_BASE_URL: string = "http://localhost:3000/track/";
describe("TRACK SERVICE TESTS", () => {
    it.only("should get a list of tracks", (done: MochaDone) => {
        const tracks: TrackMapElement[] = new Array();
        requestPromise(SERVICE_BASE_URL).then((response: string) => {
            const tempArray: Array<string> = JSON.parse(response);
            for (const document of JSON.parse(response)) {
                const iTrack: TrackDocument = JSON.parse(JSON.stringify(document));
                console.log(document);
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
});
