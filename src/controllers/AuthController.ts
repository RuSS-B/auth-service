import {Request, Response} from "express";
import {Controller} from "@/decorators/ControllerDecorator";
import {Service} from "typedi";
import {Get, Post} from "@/decorators/RouteDecorator";
import Joi from "joi";
import UserRepository from "@/repository/UserRepository";
import jwt from "jsonwebtoken";
import PasswordManager from "@/services/security/PasswordManager";
import createHttpError from "http-errors";
import config from "config";
import {addMonths} from "date-fns";
import {User} from "@/model/User";

type TJWTPayload = {
    id: number;
};

@Controller("/auth")
@Service()
export default class AuthController {
    constructor(
        private userRepository: UserRepository,
        private passwordManager: PasswordManager
    ) {}

    @Get("/info")
    async index(req: Request, res: Response) {
        res.status(200).send({
            name: "JWT Auth-Server",
            timestamp: new Date().getTime(),
        });
    }

    @Post("/register")
    async register(req: Request, res: Response) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            fullName: Joi.string().required(),
        });

        const obj = await schema.validateAsync(req.body);
        const userExists = await this.userRepository.findByEmail(obj.email); //Returns sensitive data

        if (userExists) {
            throw createHttpError.BadRequest(
                "The email already exists in the system"
            );
        }

        const user = await this.userRepository.create({
            email: obj.email,
            password: await this.passwordManager.generate(obj.password),
            fullName: obj.fullName,
        });

        res.status(200).send({id: user.id});
    }

    @Get("/verify")
    async verify(req: Request, res: Response) {
        const header = req.headers.authorization;

        if (!header || !header.includes("Bearer")) {
            throw createHttpError.Unauthorized("Invalid Authorization token");
        }

        const token = header.split(" ")[1];

        try {
            const payload = jwt.verify(
                token,
                config.get("jwt.secret")
            ) as TJWTPayload;

            res.status(200)
                .header("x-user-id", String(payload.id))
                .send(payload);
        } catch (e) {
            throw createHttpError.Unauthorized("Invalid Authorization token");
        }
    }

    @Post("/login")
    async login(req: Request, res: Response) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const obj = await schema.validateAsync(req.body);

        const user = await this.userRepository.findByEmail(obj.email); //Returns sensitive data

        const isValid = await this.passwordManager.isValid(
            obj.password,
            user.password
        );

        if (!isValid) {
            throw createHttpError.Unauthorized("Invalid username or password");
        }

        const loggedInUser: User = {
            id: user.id,
        };

        const token = jwt.sign(loggedInUser, config.get("jwt.secret"));

        res.cookie("jwt_auth", token, {
            httpOnly: true,
            secure: true,
            expires: addMonths(new Date(), 1),
        })
            .status(200)
            .send({id: user.id, token});
    }
}
