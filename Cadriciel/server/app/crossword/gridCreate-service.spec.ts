import assert = require("assert");
import { Grid } from "./gridCreate";
import { BlackTiledGrid } from "./blackTiledGrid";
// import { Word } from "../../../common/crossword/word";

it("Grid is defined on creation", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    assert(grid["grid"] !== undefined);
    done();
});

it("Grid contains appropriate number of tiles", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    const blackGrid: BlackTiledGrid = new BlackTiledGrid(grid.SIZE_GRID_X, grid.SIZE_GRID_Y, grid["grid"]);
    assert(blackGrid.NUMBER_OF_TILES === grid.SIZE_GRID_X * grid.SIZE_GRID_Y);
    done();
});

it("Grid contains appropriate number of black tiles", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    const blackGrid: BlackTiledGrid = new BlackTiledGrid(grid.SIZE_GRID_X, grid.SIZE_GRID_Y, grid["grid"]);
    let numBlackTiles: number = 0;
    for (let i: number = 0; i < grid["SIZE_GRID_X"]; i++) {
        for (let j: number = 0; j < grid["SIZE_GRID_Y"]; j++) {
            if (blackGrid["grid"][i][j].$black) {
                numBlackTiles++;
            }
        }
    }
    assert(numBlackTiles >= blackGrid["BLACK_TILES_RATIO"] * blackGrid["NUMBER_OF_TILES"]);
    done();
});

it("Grid contains words", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    assert(grid["words"].length > 0);
    done();
});

it("Grid contains a word or more per line", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    let indexCounter: number = 0;
    for (let i: number = 0; i < grid["words"].length; i++) {
        if (grid["words"][i].$startPos.$x === indexCounter) {
            indexCounter++;
            i = -1;
        }
    }
    assert(indexCounter === grid.SIZE_GRID_X);
    done();
});

it("Lexicon fills all words", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    for (const word of grid["words"]) {
        if (word.$word === "" || String(word.$word).indexOf("?", 0) > -1) {
            assert(false);
            done();
        }
    }
    assert(true);
    done();
});

it("Grid doesn't contain same words twice", (done: MochaDone) => {
    assert(false);
    done();
});
