import {Router} from "express";
import Container from "typedi";
import {IRouteDefinition} from "@/model/IRouteDefinition";
import {Logger} from "@/logger/logger";
import winston from "winston";

const logger: winston.Logger = Logger.getLogger();
export const router = Router();

export const Controller = (prefix: string): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata("prefix", prefix, target);
        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
        const routes: Array<IRouteDefinition> = Reflect.getMetadata(
            "routes",
            target
        );
        const instance: any = Container.get(target);
        routes.forEach((route: IRouteDefinition) => {
            router[route.method](
                `${prefix}${route.path}`,
                ...[
                    route.middleware ? route.middleware : [],
                    instance[route.methodName].bind(instance),
                ]
            );
            logger.debug("Registered route ", {
                path: `${prefix}${route.path}`,
                method: route.methodName,
                controller: target.name,
            });
        });
    };
};
