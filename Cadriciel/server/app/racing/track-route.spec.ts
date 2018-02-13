// import assert = require("assert");
// import * as requestPromise from "request-promise-native";
// // import { TrackRoute } from "./track-route";
// import { Track, TrackMapElement } from "../../../common/racing/track";

// const SERVICE_BASE_URL: string = "http://localhost:3000/admin/";

// describe.only("TRACK SERVICE TESTS", () => {
//     it("should get a list of tracks", (done: MochaDone) => {
//         let tracks: TrackMapElement = new Array();
//         requestPromise(SERVICE_BASE_URL).then((response: string) => {
//             tracks = JSON.parse(response);
//             console.log(tracks);
//             assert(tracks !== undefined);
//             for (const track of tracks) {
//                 assert(track !== undefined);
//                 console.log(track.value as Track);
//                 console.log(track.value !== undefined);
//                 console.log(track.value instanceof Track);
//                 assert(track.value !== undefined && track.value instanceof Track);
//             }
//             done();
//         }).catch((e: Error) => {
//             console.error(e.message);
//             assert(false);
//             done();
//         });
//     });

//     // it("word is a noun", (done: MochaDone) => {
//     //     let word: ResponseWordFromAPI;
//     //     requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Easy).then((response: string) => {
//     //         word = JSON.parse(response);
//     //         assert(word["definition"][0] === "n");
//     //         done();
//     //     }).catch((e: Error) => {
//     //         console.error(e.message);
//     //         assert(false);
//     //         done();
//     //     });

//     // });

//     // it("if word is an adj or adv, return empty word", (done: MochaDone) => {
//     //     let word: ResponseWordFromAPI;
//     //     requestPromise(SERVICE_BASE_URL + "beautiful/" + Difficulty.Easy).then((response: string) => {
//     //         word = JSON.parse(response);
//     //         assert(word["word"] === "" && word["definition"] === "");
//     //         done();
//     //     }).catch((e: Error) => {
//     //         console.error(e.message);
//     //         assert(false);
//     //         done();
//     //     });
//     // });

//     // it("if there is no definitions, it should return empty word", (done: MochaDone) => {
//     //     let word: ResponseWordFromAPI;
//     //     requestPromise(SERVICE_BASE_URL + "zent/" + Difficulty.Easy).then((response: string) => {
//     //         word = JSON.parse(response);
//     //         assert(word["word"] === "" && word["definition"] === "");
//     //         done();
//     //     }).catch((e: Error) => {
//     //         console.error(e.message);
//     //         assert(false);
//     //         done();
//     //     });
//     // });
// });
