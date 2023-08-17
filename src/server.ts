import "reflect-metadata";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const env = process.env.NODE_ENV || "development";
dotenv.config({
    path: env === "test" ? ".env.test" : ".env",
});

import app from "./app";
import {Logger} from "@/logger/logger";
import config from "config";

const logger = Logger.getLogger();

(async () => {
    const serverPort = config.get("server.port") || 80;
    app.listen(serverPort, () => {
        logger.info(
            `Server running at http://localhost:${serverPort}, NODE_ENV=${process.env.NODE_ENV}`
        );
    });
})();
