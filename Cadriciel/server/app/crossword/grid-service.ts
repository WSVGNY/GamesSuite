import { injectable, inject } from "inversify";
import Types from "../types";
import { Router, Request, Response, NextFunction } from "express";
import { GridCreate } from "./gridCreate";
import { AbstractService } from "../AbstractService";

@injectable()
export class GridService extends AbstractService {
    public readonly baseRoute: string = "/grid";

    public constructor(@inject(Types.GridCreate) private grid: GridCreate) {
        super();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/gridGet/:difficulty", (req: Request, res: Response, next: NextFunction) => {
            this.grid = new GridCreate();
            this.grid.gridCreate(req, res, next);
        });

        return router;
    }
}
