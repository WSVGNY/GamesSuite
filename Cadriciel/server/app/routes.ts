import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { EmptyGrid } from "./crossword/emptyGridCreate_service";
import { TrackRoute } from "./routes/track-route";
import { Lexicon } from "./crossword/lexicon";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.Index) private index: Index,
        @inject(Types.EmptyGrid) private emptyGrid: EmptyGrid,
        @inject(Types.TrackRoute) private piste: TrackRoute,
        @inject(Types.Lexicon) private lexique: Lexicon) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => 
            this.index.helloWorld(req, res, next)
        );
        router.get("/emptyGridGet", (req: Request, res: Response, next: NextFunction) => {
            this.emptyGrid = new EmptyGrid;
            this.emptyGrid.emptyGridCreate(req, res, next);
        });
        router.get("/admin", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackList(req, res, next)
        );
        router.get("/mock-lexique", (req: Request, res: Response, next: NextFunction) =>
            this.lexique.testLexicon(req, res, next)
        );
        router.get("/admin/:id", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackFromID(req, res, next)
        );

        return router;
    }
}
