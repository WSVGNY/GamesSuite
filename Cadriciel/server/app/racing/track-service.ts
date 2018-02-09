import { injectable, inject } from "inversify";
import Types from "../types";
import { Router, Request, Response } from "express";
import { TrackRoute } from "./track-route";
import { AbstractService } from "../AbstractService";

@injectable()
export class TrackService extends AbstractService {
    public readonly baseRoute: string = "/admin";

    public constructor( @inject(Types.TrackRoute) private trackRoute: TrackRoute) {
        super();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response) =>
            this.trackRoute.getTrackList(req, res)
        );

        router.get("/:id", (req: Request, res: Response) =>
            this.trackRoute.getTrackFromID(req, res)
        );

        router.post("/new/:name", (req: Request, res: Response) => {
            this.trackRoute.newTrack(req, res);
        });

        router.delete("/delete/:id", (req: Request, res: Response) => {
            this.trackRoute.deleteTrack(req, res);
        });

        router.put("/put/:id", (req: Request, res: Response) => {
            this.trackRoute.editTrack(req, res);
        });

        return router;
    }
}
