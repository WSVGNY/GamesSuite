import { injectable, inject } from "inversify";
import Types from "../types";
import { Router, Request, Response } from "express";
import { Lexicon } from "./lexicon";
import { AbstractService } from "../AbstractService";

@injectable()
export class LexiconService extends AbstractService {
    public readonly baseRoute: string = "/lexicon";

    public constructor( @inject(Types.Lexicon) private lexicon: Lexicon) {
        super();
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/constraints/:constraints/:difficulty", (req: Request, res: Response) =>
            this.lexicon.getWordFromConstraint(req, res)
        );

        return router;
    }
}
