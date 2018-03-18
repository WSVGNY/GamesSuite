import assert = require("assert");
import { Grid } from "./grid";
import { BlackTiledGrid } from "./blackTiledGrid";
import { GridCreate } from "./gridCreate";
import { Difficulty } from "../../../common/crossword/difficulty";
import { NUMBER_OF_TILES, NUM_BLACK_TILES, SIZE_GRID_X, SIZE_GRID_Y } from "./configuration";

let grid: Grid;
let gridCreate: GridCreate;
let blackGrid: BlackTiledGrid;

describe("GRID CREATE TESTS", () => {

    it("GridCreate grid is defined on creation", (done: MochaDone) => {
        gridCreate = new GridCreate();
        gridCreate["difficulty"] = Difficulty.Easy;
        gridCreate["newGrid"]().then(() => {
            grid = gridCreate["_grid"];
            assert(gridCreate["_grid"] !== undefined);
            done();
        }).catch((e: Error) => {
            assert(false);
            console.error(e.message);
            done();
        });
    });

    it("Grid contains appropriate number of tiles", (done: MochaDone) => {
        blackGrid = new BlackTiledGrid(grid["boxes"]);
        assert(NUMBER_OF_TILES === SIZE_GRID_X * SIZE_GRID_Y);
        done();
    });

    it("Grid contains appropriate number of black tiles", (done: MochaDone) => {
        let numBlackTiles: number = 0;
        for (let i: number = 0; i < SIZE_GRID_X; i++) {
            for (let j: number = 0; j < SIZE_GRID_Y; j++) {
                if (blackGrid["_grid"][i][j].char.value === "#") {
                    numBlackTiles++;
                }
            }
        }
        assert(numBlackTiles === NUM_BLACK_TILES);
        done();
    });

    it("Grid contains words", (done: MochaDone) => {
        assert(grid["words"].length > 0);
        done();
    });

    it("Grid contains a word or more per line", (done: MochaDone) => {
        let indexCounter: number = 0;
        for (let i: number = 0; i < grid["words"].length; i++) {
            if (grid["words"][i].startPosition.x === indexCounter) {
                indexCounter++;
                i = -1;
            }
        }
        assert(indexCounter === SIZE_GRID_X);
        done();
    });

    it("Lexicon fills all words", (done: MochaDone) => {
        for (const word of grid["words"]) {
            if (word.value === "" || String(word.value).indexOf("?", 0) > -1) {
                assert(false);
                done();
            }
        }
        assert(true);
        done();
    });

    it("Grid doesn't contain same words twice", (done: MochaDone) => {
        for (const word1 of grid["words"]) {
            for (const word2 of grid["words"]) {
                if (word1.value === word2.value && word1.id !== word2.id) {
                    assert(false);
                    done();
                }
            }
        }
        assert(true);
        done();
    });
});
