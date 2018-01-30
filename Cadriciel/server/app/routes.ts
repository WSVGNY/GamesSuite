import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { TrackRoute } from "./routes/track-route";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.Index) private index: Index,
        @inject(Types.TrackRoute) private piste: TrackRoute) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) =>
            this.index.helloWorld(req, res, next)
        );
        router.get("/admin", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackList(req, res, next)
        );
        router.get("/admin/:id", (req: Request, res: Response, next: NextFunction) =>
            this.piste.getTrackFromID(req, res, next)
        );

        return router;
    }
}
