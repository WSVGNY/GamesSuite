import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export abstract class AbstractService {
    public readonly baseRoute: string;
    public abstract get routes(): Router;
}
