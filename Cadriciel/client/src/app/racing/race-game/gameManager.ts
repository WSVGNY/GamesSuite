import { Track } from "../../../../../common/racing/track";
import { Car } from "../car/car";
import { Player } from "../../../../../common/crossword/player";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { GameScene } from "../scenes/gameScene";

enum State {
    START_ANIMATION = 1,
    COUNTDOWN,
    RACING,
    END,
}

export class GameManager {

    private _players: Player[];
    private _cars: Car[];
    private _carDebugs: AIDebug[];

    private _chosenTrack: Track;
    private _gameScene: GameScene;
    private _currentState: State;

    public constructor() {

    }
}
