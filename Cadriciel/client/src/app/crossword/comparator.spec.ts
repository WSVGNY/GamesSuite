import { CommonWord } from "../../../../common/crossword/commonWord";
import { Comparator } from "./comparator";

// tslint:disable:no-magic-numbers
describe("Comparator", () => {

    const createMockWord: Function = (idNumber: number) => {
        return {
            id: idNumber,
            isComplete: false,
            value: "ee",
            definition: "ef",
            constraints: [],
            difficulty: 1,
            parentCaller: undefined,
            definitionID: 2,
            isHorizontal: true,
            length: 2,
            startPosition: undefined,
            enteredCharacters: undefined
        } as CommonWord;
    };

    it("Two different words should return false", () => {
        const word: CommonWord = createMockWord(2);
        const word2: CommonWord = createMockWord(3);
        expect(Comparator.compareWords(word, word2)).toEqual(false);
    });

    it("Two identical words should return true", () => {
        const word: CommonWord = createMockWord(3);
        const word2: CommonWord = createMockWord(3);
        expect(Comparator.compareWords(word, word2)).toEqual(true);
    });

    it("Should not find equivalent in list", () => {
        const word1: CommonWord = createMockWord(4);
        const word2: CommonWord = createMockWord(5);
        const words: CommonWord[] = [word2];
        expect(Comparator.findEquivalent(word1, words)).toEqual(undefined);
    });

    it("Should find equivalent in list", () => {
        const word1: CommonWord = createMockWord(4);
        const word2: CommonWord = createMockWord(4);
        const words: CommonWord[] = [word2];
        expect(Comparator.findEquivalent(word1, words)).toEqual(word2);
    });

});
