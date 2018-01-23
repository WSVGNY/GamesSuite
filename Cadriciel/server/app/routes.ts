import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { EmptyGrid } from "./mot-croise/emptyGrid";
import { RoutePiste } from "./routes/route-piste";
import { Lexique } from "./mot-croise/lexique";


@injectable()
export class Routes {

    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.EmptyGrid) private emptyGrid: EmptyGrid,
                        @inject(Types.RoutePiste) private piste: RoutePiste,
                        @inject(Types.Lexique) private lexique: Lexique) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.get("/emptyGridGet", (req: Request, res: Response, next: NextFunction) => this.emptyGrid.emptyGrid(req, res, next));
        router.get("/admin", (req: Request, res: Response, next: NextFunction) => this.piste.getListePistes(req, res, next));
        router.get("/mock-lexique", (req: Request, res: Response, next: NextFunction) => this.lexique.getListeMotSelonNbLettres(req, res, next, 1));
        router.get("/mock-lexique-def", (req: Request, res: Response, next: NextFunction) => this.lexique.getDefinition(req, res, next, "talk"));

        return router;
    }
}
