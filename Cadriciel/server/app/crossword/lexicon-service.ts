import { injectable, inject } from "inversify";
import Types from "../types";
import { Router, Request, Response, NextFunction } from "express";
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

        router.get("/definition/:word", (req: Request, res: Response, next: NextFunction) =>
            this.lexicon.getWordAndDefinition(req, res, next)
        );
        router.get("/frequency/:word", (req: Request, res: Response, next: NextFunction) =>
            this.lexicon.getFrequency(req, res, next)
        );
        router.get("/constraints/:constraints", (req: Request, res: Response, next: NextFunction) =>
            this.lexicon.getWordListFromConstraint(req, res, next)
        );

        return router;
    }
}

