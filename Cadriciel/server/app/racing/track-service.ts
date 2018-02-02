import { injectable, inject } from "inversify";
import Types from "../types";
import { Router, Request, Response } from "express";
import { TrackRoute } from "./track-route";
import { AbstractService } from "../AbstractService";

@injectable()
export class TrackService extends AbstractService {
    public readonly baseRoute: string = "/admin";

    public constructor( @inject(Types.TrackRoute) private piste: TrackRoute) {
        super();
    }

    public get routes(): Router {
        const router: Router = Router();


        router.get("/", (req: Request, res: Response) =>
            this.piste.getTrackList(req, res)
        );
        router.get("/:id", (req: Request, res: Response) =>
            this.piste.getTrackFromID(req, res)
        );

        return router;
    }
}

