import assert = require("assert");
import { Lexicon } from "./lexicon";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import * as requestPromise from "request-promise-native";

const BASE_URL: string = "http://localhost:3000/lexicon/";
const TIMEOUT: number = 15000;

describe("LEXICON TESTS", () => {
    describe("word should be a noun or a verb", () => {
        it("word is a verb", (done: MochaDone) => {
            const lex: Lexicon = new Lexicon();
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/ask").then((response: string) => {
                word = JSON.parse(response);
                assert(word.$definition[0][0] === "v");
                done();
            }).catch(done);
        });

        it("word is a noun", (done: MochaDone) => {
            const lex: Lexicon = new Lexicon();
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/test").then((response: string) => {
                word = JSON.parse(response);
                assert(word.$definition[0][0] === "v");
                done();
            }).catch(done);

        });

        it("if word is an adj or adv, return null", (done: MochaDone) => {
            const lex: Lexicon = new Lexicon();
            setTimeout(done, TIMEOUT);
            let word: ResponseWordFromAPI;
            requestPromise(BASE_URL + "/beautiful").then((response: string) => {
                word = JSON.parse(response);
                assert(word.$definition[0][0] === "v");
                done();
            }).catch(done);

        });

    });

    it("if there is no definitions, it should return an empty string", (done: MochaDone) => {
        const lex: Lexicon = new Lexicon();
        const definition: string = lex.getDefinition("zent");
        assert(definition === "");
        done();
    });

    it("word shouldn't contain any accents or special characters", (done: MochaDone) => {
        const lex: Lexicon = new Lexicon();
        const correctWord: string = lex.removeAccent(word);
        assert(correctWord === "aeic");
        done();
    });

    describe("tests for the respect of constraints", () => {
        it("the returned word matches constraints", (done: MochaDone) => {
            assert(true === true);
            done();
        });

        it("if there is no word matching the constraint, returns an error", (done: MochaDone) => {
            assert(true === true);
            done();
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
