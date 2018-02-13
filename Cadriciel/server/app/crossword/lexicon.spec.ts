import assert = require("assert");
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import * as requestPromise from "request-promise-native";
import { Lexicon } from "./lexicon";
import { Difficulty } from "../../../common/crossword/difficulty";

const SERVICE_BASE_URL: string = "http://localhost:3000/lexicon/";
const DATAMUSE_BASE_URL: string = "https://api.datamuse.com/words?md=fd&sp=";
const UNWANTED_CHARACTERS_LENGTH: number = 2;
const FREQUENCY_DELIMITER: number = 5;

describe("LEXICON TESTS", () => {
    it("is datamuse up", (done: MochaDone) => {
        requestPromise(DATAMUSE_BASE_URL + "????").then((response: string) => {
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
            requestPromise(SERVICE_BASE_URL + "ask/" + Difficulty.Easy).then((response: string) => {
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
            requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Easy).then((response: string) => {
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
            requestPromise(SERVICE_BASE_URL + "beautiful/" + Difficulty.Easy).then((response: string) => {
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
        requestPromise(SERVICE_BASE_URL + "zent/" + Difficulty.Easy).then((response: string) => {
            word = JSON.parse(response);
            assert(word["word"] === "" && word["definition"] === "");
            done();
        }).catch((e: Error) => {
            console.error(e.message);
            assert(false);
            done();
        });
    });

    describe("tests for accents or special characters", () => {
        it("word shouldn't contain any accents or special characters", (done: MochaDone) => {
            const lex: Lexicon = new Lexicon();
            const correctWord: string = lex["removeAccent"]("éàïç");
            assert(correctWord === "EAIC");
            done();
        });

        it("Special characters should be ignored when sent to the api", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(SERVICE_BASE_URL + "aréa/" + Difficulty.Easy).then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"] === "AREA");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("Accents should be ignored even when sent in url encoding", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(SERVICE_BASE_URL + "ar%c3%a9a/" + Difficulty.Easy).then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"] === "AREA");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });
    });

    describe("tests for the respect of constraints", () => {
        it("the returned word matches constraints", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            const TEST_LETTER_POSITION: number = 3;
            requestPromise(SERVICE_BASE_URL + "t%3f%3ft/" + Difficulty.Easy).then((response: string) => {
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
            requestPromise(SERVICE_BASE_URL + "ttttt/" + Difficulty.Easy).then((response: string) => {
                word = JSON.parse(response);
                assert(word["word"] === "" && word["definition"] === "");
                done();
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if is no word returned from the api, returns an empty word", (done: MochaDone) => {
            let word: ResponseWordFromAPI;
            requestPromise(SERVICE_BASE_URL + "tttttt/" + Difficulty.Easy).then((response: string) => {
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
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Easy).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "test").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    assert(wordFromDataMuse[0]["defs"][0] === wordFromService["definition"]);
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if difficulty is MEDIUM, returns the second definition", (done: MochaDone) => {
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Medium).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "test").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    assert(wordFromDataMuse[0]["defs"][1] === wordFromService["definition"]);
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if difficulty is HARD, returns the second definition", (done: MochaDone) => {
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "bail/" + Difficulty.Hard).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "bail").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    assert(wordFromDataMuse[0]["defs"][1] === wordFromService["definition"]);
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if difficulty is EASY, frequency­ > 10", (done: MochaDone) => {
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Easy).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "test").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    const frequency: number = wordFromDataMuse[0]["tags"][0].substring(UNWANTED_CHARACTERS_LENGTH);
                    assert(
                        wordFromDataMuse[0]["word"].toUpperCase() === wordFromService["word"].toUpperCase()
                        && (frequency > FREQUENCY_DELIMITER)
                    );
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if difficulty is MEDIUM, frequency­ > 10", (done: MochaDone) => {
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "test/" + Difficulty.Medium).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "test").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    const frequency: number = wordFromDataMuse[0]["tags"][0].substring(UNWANTED_CHARACTERS_LENGTH);
                    assert(
                        wordFromDataMuse[0]["word"].toUpperCase() === wordFromService["word"].toUpperCase()
                        && (frequency > FREQUENCY_DELIMITER)
                    );
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });

        it("if difficulty is HARD, frequency­ < 10", (done: MochaDone) => {
            let wordFromService: ResponseWordFromAPI;
            let wordFromDataMuse: string[];
            requestPromise(SERVICE_BASE_URL + "bail/" + Difficulty.Hard).then((responseFromService: string) => {
                wordFromService = JSON.parse(responseFromService);
                requestPromise(DATAMUSE_BASE_URL + "bail").then((responseFromDataMuse: string) => {
                    wordFromDataMuse = JSON.parse(responseFromDataMuse);
                    const frequency: number = wordFromDataMuse[0]["tags"][0].substring(UNWANTED_CHARACTERS_LENGTH);
                    assert(
                        wordFromDataMuse[0]["word"].toUpperCase() === wordFromService["word"].toUpperCase()
                        && (frequency < FREQUENCY_DELIMITER)
                    );
                    done();
                }).catch((e: Error) => {
                    console.error(e.message);
                    assert(false);
                    done();
                });
            }).catch((e: Error) => {
                console.error(e.message);
                assert(false);
                done();
            });
        });
    });
});
