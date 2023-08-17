import {Service} from "typedi";
import PrismaRepository from "@/repository/PrismaRepository";

@Service()
export default class UserRepository extends PrismaRepository {
    public async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    public async create({
        email,
        password,
        fullName,
    }: {
        email: string;
        password: string;
        fullName: string;
    }) {
        return this.prisma.user.create({
            data: {
                email,
                password,
                fullName,
            },
        });
    }
}
