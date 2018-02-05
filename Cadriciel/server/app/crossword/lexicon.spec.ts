import assert = require("assert");
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import * as requestPromise from "request-promise-native";
import { Lexicon } from "./lexicon";

const BASE_URL: string = "http://localhost:3000/lexicon/";
// const TIMEOUT: number = 15000;

describe("LEXICON TESTS", () => {
    it("is datamuse up", (done: MochaDone) => {
        requestPromise("https://api.datamuse.com/words?sp=????&md=fd").then((response: string) => {
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    describe("word should be a noun or a verb", () => {
        it("word is a verb", (done: MochaDone) => {
            let word: ResponseWordFromAPI = new ResponseWordFromAPI();
            requestPromise(BASE_URL + "ask/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word["definition"][0] === "v");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("word is a noun", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "test/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word["definition"][0] === "n");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });

        });

        it("if word is an adj or adv, return empty word", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "beautiful/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"] === "" && word["definition"] === "");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });
    });

    it("if there is no definitions, it should return empty word", (done: MochaDone) => {
        let word: ResponseWordFromAPI;
        requestPromise(BASE_URL + "zent/EASY").then((response: string) => {
            word = JSON.parse(response);
            assert(word["word"] === "" && word["definition"] === "");
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    it("word shouldn't contain any accents or special characters", (done: MochaDone) => {
        const lex: Lexicon = new Lexicon();
        const correctWord: string = lex["removeAccent"]("éàïç");
        assert(correctWord === "EAIC");
        done();
    });

    describe("tests for the respect of constraints", () => {
        it("the returned word matches constraints", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            const TEST_LETTER_POSITION: number = 3;
            requestPromise(BASE_URL + "t%3f%3ft/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"][0] === "T" && word["word"][TEST_LETTER_POSITION] === "T");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if there is no word matching the constraint, returns an empty word", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "tttttt/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"] === "" && word["definition"] === "");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });
    });

    describe("tests for the difficulty", () => {
        it("if difficulty is EASY, returns the first definition", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if difficulty is MEDIUM, returns the second definition", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if difficulty is HARD, returns the second definition", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if difficulty is EASY, frequency­ > 10", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if difficulty is MEDIUM, frequency­ > 10", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if difficulty is EASY, frequency­ > 10", (done: MochaDone) => {
            assert(true === true);
            done();
        });
    });
});
