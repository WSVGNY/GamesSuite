import assert = require("assert");
import { Lexicon } from "./lexicon";

describe("word should be a noun or a verb", function(){
    it("word is a verb", (done: MochaDone) => {
        const lex: Lexicon = new Lexicon();
        let word:string = "ask";
        let definition : string = lex.getDefinition(word);
        assert(definition[0][0] == "v");
        done();
    });

    it("if word is an adj or adv, return null", (done: MochaDone) => {
        const lex: Lexicon = new Lexicon();
        let word:string = "____";
        let definition : string = lex.getDefinition(word);
        assert(definition[0] == null);
        done();
    });

});
  
it("if there is no definitions, it should return null", (done: MochaDone) => {
    const lex: Lexicon = new Lexicon();
    let definition : string = lex.getDefinition("zent");
    assert(definition == null);
    done();
});

/*
it("word shouldn't contain any accents or special characters", (done: MochaDone) => {
    const lex: Lexicon = new Lexicon();
    const word:string = "àéì--Ç"
    lex.removeAccent(word);
    console.log(word);
    assert(word!="aei");
    done();
});

    


it("the word matches constraints", (done: MochaDone) => {
    });

    */