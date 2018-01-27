import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { Grid } from "./crossword/gridCreate_service";
import { RoutePiste } from "./routes/route-piste";
import { Lexique } from "./crossword/lexique";

@injectable()
export class Routes {

    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.Grid) private grid: Grid,
                        @inject(Types.RoutePiste) private piste: RoutePiste,
                        @inject(Types.Lexique) private lexique: Lexique) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.get("/gridGet", (req: Request, res: Response, next: NextFunction) => {
            this.grid = new Grid;
            this.grid.gridCreate(req, res, next);
        } );
        router.get("/admin", (req: Request, res: Response, next: NextFunction) => this.piste.getListePistes(req, res, next));
        router.get("/mock-lexique", (req: Request, res: Response, next: NextFunction) =>
                                    this.lexique.getListeMotSelonNbLettres(req, res, next, 1));
        router.get("/mock-lexique-def", (req: Request, res: Response, next: NextFunction) =>
                                    this.lexique.getDefinition(req, res, next, "talk"));
        router.get("/admin/:id", (req: Request, res: Response, next: NextFunction) => this.piste.getPisteParID(req, res, next));

        return router;
    }
}
