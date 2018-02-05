import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import Types from "./types";
import { injectable, inject } from "inversify";
import { LexiconService } from "./crossword/lexicon-service";
import { GridCreateService } from "./crossword/gridCreate-service";
import { AbstractService } from "./AbstractService";
import { TrackService } from "./racing/track-service";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    constructor(
        @inject(Types.LexiconService) private lexicon: LexiconService,
        @inject(Types.GridCreateService) private grid: GridCreateService,
        @inject(Types.TrackService) private tracks: TrackService
    ) {

        this.app = express();

        this.configMiddleware();

        this.addService(this.lexicon);
        this.addService(this.grid);
        this.addService(this.tracks);
    }

    private configMiddleware(): void {
        // Middlewares configuration
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

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
