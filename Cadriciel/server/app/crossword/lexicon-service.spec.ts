import { assert } from "../routes/sample.spec";
import { LexiconService } from "./lexicon-service";

it("lexicon should be defined", (done: MochaDone) => {
    const lex: LexiconService = new LexiconService();
    assert(lex != null || lex !== undefined);
    done();
});

it("lexicon should return a word with a definition", (done: MochaDone) => {
    // const lex: LexiconService = new LexiconService();
    // lex.getWordAndDefinition("test").then(
    //     (s: string) => {
    //         assert(s === "[{\"word\":\"test\"},{\"def\":\"the act of testing something\"}]");
    //         done();
    //     }
    // ).catch(done);
});
