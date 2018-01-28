import { assert } from "../routes/sample.spec";
import { Lexicon } from "./lexicon";

it("lexicon should be defined", (done: MochaDone) => {
    const lex: Lexicon = new Lexicon();
    assert(lex != null || lex !== undefined);
    done();
});

it("lexicon should return a word with a definition", (done: MochaDone) => {
    const lex: Lexicon = new Lexicon();
    lex.getWordAndDefinition("test").then(
        (s: string) => {
            assert(s === "[{\"word\":\"test\"},{\"def\":\"the act of testing something\"}]");
            done();
        }
    ).catch(done);
});
