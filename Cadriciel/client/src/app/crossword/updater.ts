import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ListChecker } from "./listChecker";
import { Comparator } from "./comparator";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";

export abstract class Updater {
    public static updateGrid(configuration: ConfigurationService, inputGridBox: CommonGridBox): CommonGridBox {
        this.resetGrid(configuration);
        this.setSelectedBoxes(configuration.currentPlayer.selectedWord, configuration);
        this.setFoundBoxes(configuration);

        return this.setInputBox(configuration, inputGridBox);
    }

    private static resetGrid(configuration: ConfigurationService): void {
        if (configuration.grid !== undefined && configuration.configurationDone) {
            configuration.currentPlayer.selectedBoxes = [];
        }
    }

    private static setSelectedBoxes(word: CommonWord, configuration: ConfigurationService): void {
        if (word !== undefined) {
            for (let i: number = 0; i < word.length; i++) {
                let box: CommonGridBox;
                word.isHorizontal ?
                    box = configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i] :
                    box = configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x];
                configuration.currentPlayer.selectedBoxes.push(box);
            }
        }
    }

    public static setFoundBoxes(configuration: ConfigurationService): void {
        for (const word of configuration.currentPlayer.foundWords) {
            for (let i: number = 0; i < word.length; i++) {
                let box: CommonGridBox;
                word.isHorizontal ?
                    box = configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i] :
                    box = configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x];
                configuration.currentPlayer.foundBoxes.push(box);
            }
        }
    }

    public static setInputBox(configuration: ConfigurationService, inputGridBox: CommonGridBox): CommonGridBox {
        if (configuration.currentPlayer.selectedWord !== undefined &&
            !ListChecker.playersFoundWord(configuration.currentPlayer.selectedWord, configuration)) {
            if (ListChecker.playersFoundBox(configuration.grid.boxes[configuration.getY()][configuration.getX()], configuration)) {
                Comparator.goToNextAvailableBox(configuration);
                this.setInputBox(configuration, inputGridBox);
            } else {
                inputGridBox = configuration.grid.boxes[configuration.getY()][configuration.getX()];
            }
        }

        return inputGridBox;
    }

    public static updateInputCharInBoxes(configuration: ConfigurationService): void {
        if (!configuration.isTwoPlayerGame) {
            return;
        }
        for (const line of configuration.grid.boxes) {
            for (const box1 of line) {
                this.handleBox(box1, configuration.otherPlayer.foundBoxes);
            }
        }

    }

    private static handleBox(box1: CommonGridBox, boxes: CommonGridBox[]): void {
        for (const box2 of boxes) {
            if (box1.id.x === box2.id.x && box1.id.y === box2.id.y) {
                box1.inputChar = box2.inputChar;
            }
        }
    }
}
