import {Errback, Request, Response, NextFunction} from "express";
import {isHttpError} from "http-errors";
import process from "process";
import {Logger} from "@/logger/logger";

const logger = Logger.getLogger();

const errorHandler = (
    err: Errback,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (isHttpError(err)) {
        res.status(err.statusCode).json({message: err.message});
    } else {
        const message =
            process.env.NODE_ENV === "PROD"
                ? "Uh oh! Something went wrong"
                : err.toString();

        if (err instanceof Error) {
            logger.error({
                name: err.name,
                stack: err.stack,
                message: err.message,
            });
        } else {
            logger.error(err.toString());
        }

        res.status(500).json({message});
    }
};

export {errorHandler};
