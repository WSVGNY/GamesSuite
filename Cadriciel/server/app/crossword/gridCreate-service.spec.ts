import assert = require("assert");
import { Grid } from "./gridCreate";
// import { BlackTiledGrid } from "./blackGridTilesPlacer";

it("Grid contains appropriate number of black tiles", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    // const blackGrid: BlackTiledGrid = new BlackTiledGrid(grid.SIZE_GRID_X, grid.SIZE_GRID_Y, grid["grid"]);
    let numBlackTiles: number = 0;
    for (let i: number = 0; i < grid["SIZE_GRID_X"]; i++) {
        for (let j: number = 0; j < grid["SIZE_GRID_Y"]; j++) {
            if (grid["grid"][i][j].$black) {
                numBlackTiles++;
            }
        }
    }
    assert(numBlackTiles >= grid["BLACK_TILES_RATIO"] * grid["NUMBER_OF_TILES"]);
    done();
});

it("Grid contains appropriate number of tiles", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    assert(grid["NUMBER_OF_TILES"] === grid.SIZE_GRID_X * grid.SIZE_GRID_Y);
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
