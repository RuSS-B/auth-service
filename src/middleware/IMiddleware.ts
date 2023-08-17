import {NextFunction, Request, Response} from "express";

export interface IMiddleware {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}
