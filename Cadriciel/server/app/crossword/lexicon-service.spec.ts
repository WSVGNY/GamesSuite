import { assert } from "../routes/sample.spec";
import { LexiconService } from "./lexicon-service";
import * as http from "http";

const BASE_URL: string = "http://localhost:3000/lexicon/";
const TIMEOUT: number = 15000;

it("lexicon should be defined", (done: MochaDone) => {
    const lex: LexiconService = new LexiconService();
    assert(lex != null && lex !== undefined);
    done();
});

it("lexicon should return a word with a definition", (done: MochaDone) => {
    let wordAndDef: ({ "word": string; } | { "def": string; });
    setTimeout(done, TIMEOUT);

    http.get(BASE_URL + "definition/test", (response: http.IncomingMessage) => {
        response.on("data", (d: string) => {
            wordAndDef = JSON.parse(d);
            assert(wordAndDef["word"] === "test");
            assert(wordAndDef["def"] != null
                && wordAndDef["def"] !== undefined
                && typeof wordAndDef["def"] === "string");
            done();
        });
    }).on("error", (e: Error) => {
        assert(false);
        done();
    });
});

it("lexicon should return a words frequency", (done: MochaDone) => {
    let frequency: number;
    setTimeout(done, TIMEOUT);

    http.get(BASE_URL + "frequency/test", (response: http.IncomingMessage) => {
        response.on("data", (d: string) => {
            frequency = JSON.parse(d);
            assert(frequency != null && frequency !== undefined && typeof frequency === "number");
            done();
        });
    }).on("error", (e: Error) => {
        assert(false);
        done();
    });
});
