import {IMiddleware} from "@/middleware/IMiddleware";

export interface IRouteDefinition {
    path: string;
    method: "get" | "post" | "put" | "patch" | "delete";
    methodName: string;
    middleware?: IMiddleware[];
}
