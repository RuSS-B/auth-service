import winston from "winston";
import config from "config";

type LoggerConfig = {
    level: string;
};

export class Logger {
    private static logger: winston.Logger;

    public static getLogger() {
        if (!this.logger) {
            this.initLogger(config.get("logger"));
        }
        return this.logger;
    }

    private static initLogger(loggerConfig: LoggerConfig) {
        const loggerOptions: winston.LoggerOptions = {
            level: loggerConfig.level || "info",
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.errors({stack: true}),
                        winston.format.timestamp(),
                        winston.format.json(),
                        winston.format.prettyPrint(),
                        winston.format.colorize({all: true})
                    ),
                }),
            ],
        };

        this.logger = winston.createLogger(loggerOptions);
    }
}
