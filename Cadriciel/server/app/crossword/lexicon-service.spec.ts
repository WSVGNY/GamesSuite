import assert = require("assert");
import { LexiconService } from "./lexicon-service";
// import * as http from "http";
// import * as requestPromise from "request-promise-native";
import { Lexicon } from "./lexicon";

// const BASE_URL: string = "http://localhost:3000/lexicon/";
// const TIMEOUT: number = 15000;

it("lexicon should be defined", (done: MochaDone) => {
    const lex: LexiconService = new LexiconService(new Lexicon());
    assert(lex != null && lex !== undefined);
    done();
});

it("lexicon should return a word with a definition", (done: MochaDone) => {
    // let wordAndDef: ({ "word": string; } | { "def": string; });
    // setTimeout(done, TIMEOUT);

    // requestPromise(BASE_URL + "/definition/test").then((response: string) => {
    //     wordAndDef = JSON.parse(response);
    //     assert(wordAndDef["word"] === "test");
    //     assert(wordAndDef["def"] != null
    //         && wordAndDef["def"] !== undefined
    //         && typeof wordAndDef["def"] === "string");
    //     done();
    // }).catch(done);

});

it("lexicon should return a words frequency", (done: MochaDone) => {
    // let frequency: number;
    // setTimeout(done, TIMEOUT);

    // http.get(BASE_URL + "frequency/test", (response: http.IncomingMessage) => {
    //     response.on("data", (d: string) => {
    //         frequency = JSON.parse(d);
    //         assert(frequency != null && frequency !== undefined && typeof frequency === "number");
    //         done();
    //     });
    // }).on("error", (e: Error) => {
    //     assert(false);
    //     done();
    // });
});
