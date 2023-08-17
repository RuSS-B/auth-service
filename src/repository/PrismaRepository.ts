import {PrismaClient} from "@prisma/client";
import {Service} from "typedi";

@Service()
export default abstract class PrismaRepository {
    public constructor(protected prisma: PrismaClient) {}
}
