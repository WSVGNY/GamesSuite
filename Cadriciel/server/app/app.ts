import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import Types from "./types";
import { injectable, inject } from "inversify";
import { LexiconService } from "./crossword/lexicon-service";
import { GridService } from "./crossword/grid-service";
import { AbstractService } from "./AbstractService";
import { TrackService } from "./racing/track-service";

@injectable()
export class Application {

    public app: express.Application;

    constructor(
        @inject(Types.LexiconService) private lexicon: LexiconService,
        @inject(Types.GridService) private grid: GridService,
        @inject(Types.TrackService) private tracks: TrackService
    ) {

        this.app = express();

        this.configMiddleware();

        this.addService(this.lexicon);
        this.addService(this.grid);
        this.addService(this.tracks);
    }

    private configMiddleware(): void {
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../client")));
        this.app.use(cors());
    }

    private addService(service: AbstractService): void {
        this.app.use(service.baseRoute, service.routes);
    }
}
