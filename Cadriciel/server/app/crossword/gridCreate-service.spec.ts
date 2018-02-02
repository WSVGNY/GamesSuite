import assert = require("assert");
import { Grid } from "./gridCreate";

it("Grid contains appropriate number of black tiles", (done: MochaDone) => {
    const grid: Grid = new Grid();
    grid["newGrid"]();
    let numBlackTiles: number = 0;
    for (let i: number = 0; i < grid["SIZE_GRID_X"]; i++) {
        for (let j: number = 0; j < grid["SIZE_GRID_Y"]; j++) {
            if (grid["grid"][i][j].$black) {
                numBlackTiles++;
            }
        }
    }
    console.log(numBlackTiles);
    console.log(grid["BLACK_TILES_RATIO"] * grid["NUMBER_OF_TILES"]);
    assert(numBlackTiles >= grid["BLACK_TILES_RATIO"] * grid["NUMBER_OF_TILES"]);
    done();
});
