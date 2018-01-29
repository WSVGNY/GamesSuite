import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { TrackRoute } from "./routes/track-route";
import { LexiconService } from "./crossword/lexicon-service";
import { Grid } from "./crossword/gridCreate_service";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.Index) private index: Index,
        @inject(Types.Grid) private grid: Grid,
        @inject(Types.TrackRoute) private piste: TrackRoute,
        @inject(Types.LexiconService) private lexique: LexiconService) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) =>
            this.index.helloWorld(req, res, next)
        );
        router.get("/gridGet", (req: Request, res: Response, next: NextFunction) => {
            this.grid = new Grid;
            this.grid.gridCreate(req, res, next);
        });
        router.get("/admin", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackList(req, res, next)
        );
        router.get("/lexicon/definition/:word", (req: Request, res: Response, next: NextFunction) =>
            this.lexique.getWordAndDefinition(req, res, next)
        );
        router.get("/lexicon/frequency/:word", (req: Request, res: Response, next: NextFunction) =>
            this.lexique.getFrequency(req, res, next)
        );
        router.get("/lexicon/constraints/:constraints", (req: Request, res: Response, next: NextFunction) =>
            this.lexique.getWordListFromConstraint(req, res, next)
        );
        router.get("/admin/:id", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackFromID(req, res, next)
        );

        return router;
    }
}
