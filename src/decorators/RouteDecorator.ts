import {IRouteDefinition} from "@/model/IRouteDefinition";
import {IMiddleware} from "@/middleware/IMiddleware";

export function Get(path: string, ...middleware: IMiddleware[]) {
    return (target: any, propertyKey: string): void => {
        defineMetadata(path, target, propertyKey, "get", ...middleware);
    };
}

export function Post(path: string, ...middleware: IMiddleware[]) {
    return (target: any, propertyKey: string): void => {
        defineMetadata(path, target, propertyKey, "post", ...middleware);
    };
}

export function Patch(path: string, ...middleware: IMiddleware[]) {
    return (target: any, propertyKey: string): void => {
        defineMetadata(path, target, propertyKey, "patch", ...middleware);
    };
}

const defineMetadata = (
    path: string,
    target: any,
    propertyKey: string,
    method: IRouteDefinition["method"],
    ...middleware: IMiddleware[]
) => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes = Reflect.getMetadata(
        "routes",
        target.constructor
    ) as Array<IRouteDefinition>;
    routes.push({
        method,
        path,
        methodName: propertyKey,
        middleware,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
};
