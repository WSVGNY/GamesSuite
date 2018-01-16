import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";

module Route {

    @injectable()
    export class EmptyGrid {
        public emptyGrid(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hi";
            message.body = "World";
            res.send(JSON.stringify(message));
        }
    }
}

export = Route;
