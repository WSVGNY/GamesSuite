import assert = require("assert");
import * as requestPromise from "request-promise-native";
import { Track } from "../../../common/racing/track";

const SERVICE_BASE_URL: string = "http://localhost:3000/track/";
describe("TRACK SERVICE TESTS", () => {

    it("should get a list of tracks", (done: MochaDone) => {
        const tracks: Track[] = [];
        requestPromise(SERVICE_BASE_URL).then((response: Track[]) => {
            for (const document of response) {
                const iTrack: Track = Track.createFromJSON(JSON.stringify(document));
                if (iTrack.isTestTrack) {
                    assert(false);
                    done();
                }
                tracks.push(iTrack);
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
        requestPromise(SERVICE_BASE_URL + "5ab4aa0753bced3d5c56761e").then((response: string) => {
            const track: Track = Track.createFromJSON(response);
            assert(track.id === "5ab4aa0753bced3d5c56761e");
            assert(track.isTestTrack);
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    it("should edit a track", (done: MochaDone) => {
        const randomNumber: number = Math.random();
        const trackToEdit: Track = new Track("5ab4aa0753bced3d5c56761e", true);
        trackToEdit.name = randomNumber.toString();
        const options: requestPromise.OptionsWithUrl = {
            method: "PUT",
            url: SERVICE_BASE_URL + "put/5ab4aa0753bced3d5c56761e",
            body: trackToEdit,
            json: true
        };
        requestPromise(options).then((response: Track) => {
            const iTrack: Track = Track.createFromJSON(JSON.stringify(response));
            assert(iTrack.id === "5ab4aa0753bced3d5c56761e");
            assert(iTrack.name === randomNumber.toString());
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    // tslint:disable-next-line:max-func-body-length
    it("should create a new track then delete it", (done: MochaDone) => {
        const trackName: string = "New Test Track 2394758329673294932865";
        const newTrack: Track = new Track(undefined, true);
        delete newTrack["_id"];
        newTrack.name = trackName;
        let options: requestPromise.OptionsWithUrl = {
            method: "POST",
            url: SERVICE_BASE_URL + "new",
            body: newTrack,
            json: true
        };
        requestPromise(options).then((responseFromNew: Track) => {
            const iTrack: Track = Track.createFromJSON(JSON.stringify(responseFromNew));
            assert(trackName === iTrack.name);
            options = {
                method: "DELETE",
                url: SERVICE_BASE_URL + "delete/" + iTrack.id,
                json: true
            };
            requestPromise(options).then((responseFromDelete: Track[]) => {
                const tracks: Track[] = responseFromDelete;
                for (const track of tracks) {
                    assert(trackName !== track.name, trackName + "  " + track.name);
                }
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });
});
