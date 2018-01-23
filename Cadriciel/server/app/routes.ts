import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { EmptyGrid } from "./mot-croise/emptyGrid";
import { RoutePiste } from "./routes/route-piste";


@injectable()
export class Routes {

    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.EmptyGrid) private emptyGrid: EmptyGrid,
                        @inject(Types.RoutePiste) private piste: RoutePiste) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
            (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.get("/emptyGridGet",
            (req: Request, res: Response, next: NextFunction) => this.emptyGrid.emptyGrid(req, res, next));
        router.get("/admin", (req: Request, res: Response, next: NextFunction) => this.piste.getListePistes(req, res, next));
        router.get("/admin/:id", (req: Request, res: Response, next: NextFunction) => this.piste.getPisteParID(req, res, next));

        return router;
    }
}
