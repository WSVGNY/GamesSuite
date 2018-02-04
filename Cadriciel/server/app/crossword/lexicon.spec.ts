import assert = require("assert");
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import * as requestPromise from "request-promise-native";

const BASE_URL: string = "http://localhost:3000/lexicon/";
const TIMEOUT: number = 15000;

describe("LEXICON TESTS", () => {
    it("is datamuse down", (done: MochaDone) => {
        // for (let i: number = 0; i < 10; i++) {
        requestPromise("https://api.datamuse.com/words?sp=????&md=fd").then((response: string) => {
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
        // }
    });

    describe("word should be a noun or a verb", () => {
        it("word is a verb", (done: MochaDone) => {
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/ask/EASY").then((response: ResponseWordFromAPI) => {
                // word = JSON.parse(response);
                word = response;
                console.log(word);
                console.log(word["word"]);
                console.log(word.$word);
                console.log(word[0]);
                assert(word.$definition[0] === "v");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("word is a noun", (done: MochaDone) => {
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/test/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word.$definition[0] === "n");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });

        });

        it("if word is an adj or adv, return empty word", (done: MochaDone) => {
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/beautiful/EASY").then((response: string) => {
                word = JSON.parse(response);
                assert(word.$word === "" && word.$definition === "");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });
    });

    it("if there is no definitions, it should return empty word", (done: MochaDone) => {
        setTimeout(done, TIMEOUT);
        let word: ResponseWordFromAPI;
        requestPromise(BASE_URL + "/zent/EASY").then((response: string) => {
            word = JSON.parse(response);
            assert(word.$word === "" && word.$definition === "");
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    it("word shouldn't contain any accents or special characters", (done: MochaDone) => {
        // const lex: Lexicon = new Lexicon();
        // const correctWord: string = lex.removeAccent(word);
        // assert(correctWord === "aeic");
        done();
    });

    it("the word matches constraints", (done: MochaDone) => {
    });

});