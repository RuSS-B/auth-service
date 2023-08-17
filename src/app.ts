import * as winston from "winston";
import * as expressWinston from "express-winston";

import "express-async-errors";
import express from "express";

import DBClient from "@/db/prisma";
import Container from "typedi";
import {PrismaClient} from "@prisma/client";

const dbClient = new DBClient();
Container.set(PrismaClient, dbClient.getPrisma());

import "@/controllers/AuthController";
import {router} from "@/decorators/ControllerDecorator";

import {errorHandler} from "@/middleware/errorHandler";
class App {
    public server;

    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
        this.server.use(errorHandler);
    }

    middlewares() {
        const loggerOptions: expressWinston.LoggerOptions = {
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.json(),
                winston.format.prettyPrint(),
                winston.format.colorize({all: true})
            ),
        };

        if (process.env.NODE_ENV === "development") {
            loggerOptions.meta = false;
        }
        this.server.use(expressWinston.logger(loggerOptions));
        this.server.use(express.json());
    }

    routes() {
        this.server.use(router);
    }
}

export default new App().server;
