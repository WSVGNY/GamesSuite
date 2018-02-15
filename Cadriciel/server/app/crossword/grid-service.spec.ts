import assert = require("assert");
import { Grid } from "./gridCreate";
import { BlackTiledGrid } from "./blackTiledGrid";

let grid: Grid;
let blackGrid: BlackTiledGrid;

describe("GRID CREATE TESTS", () => {

    it("Grid is defined on creation", (done: MochaDone) => {
        grid = new Grid();
        grid["newGrid"]().then(() => {
            assert(grid["grid"] !== undefined);
            done();
        }).catch((e: Error) => {
            assert(false);
            console.error(e.message);
            done();
        });
    });

    it("Grid contains appropriate number of tiles", (done: MochaDone) => {
        blackGrid = new BlackTiledGrid(grid.SIZE_GRID_X, grid.SIZE_GRID_Y, grid["grid"]);
        assert(blackGrid.NUMBER_OF_TILES === grid.SIZE_GRID_X * grid.SIZE_GRID_Y);
        done();
    });

    it("Grid contains appropriate number of black tiles", (done: MochaDone) => {
        let numBlackTiles: number = 0;
        for (let i: number = 0; i < grid["SIZE_GRID_X"]; i++) {
            for (let j: number = 0; j < grid["SIZE_GRID_Y"]; j++) {
                if (blackGrid["grid"][i][j].isBlack) {
                    numBlackTiles++;
                }
            }
        }
        assert(numBlackTiles >= blackGrid["BLACK_TILES_RATIO"] * blackGrid["NUMBER_OF_TILES"]);
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
        assert(indexCounter === grid.SIZE_GRID_X);
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
