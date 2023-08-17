import {Prisma, PrismaClient} from "@prisma/client";
import config from "config";
import {Logger} from "@/logger/logger";

const logger = Logger.getLogger();

export default class DBClient {
    private prisma: PrismaClient;

    constructor() {
        if (!this.prisma) {
            this.init();
        }
    }

    private init() {
        const logLevel: Array<Prisma.LogLevel | Prisma.LogDefinition> =
            config.get("prisma.logLevel");

        this.prisma = new PrismaClient({
            log: logLevel,
        });

        logger.info(`Prisma initialized with log level(s) "${logLevel}"`);
    }

    public getPrisma() {
        return this.prisma;
    }
}
