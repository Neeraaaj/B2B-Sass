import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { NextFunction, Request, Response } from "express";
import path from "path";

const PROTO_PATH = path.join("/", "proto", "auth.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const proto = grpc.loadPackageDefinition(packageDefinition).auth as any;

const grPCAuthClient = new proto.AuthService(
    "auth-service:50053",
    grpc.credentials.createInsecure()
);


export function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        grPCAuthClient.RegisterUser(
            {
                email: req.body.email,
                password: req.body.password
            },
            (error: any, response: any) => {
                if (error) {
                    next(error);
                } else {
                    res.json(response);
                }
            }
        );
    } catch(error) {
        next(error);
    }
}


export function verifyUserEmail(req: Request, res: Response, next: NextFunction) {
    try {
        grPCAuthClient.VerifyUserEmail(
            {
                email: req.body.email,
                otpCode: req.body.otpCode
            },
            (error: any, response: any) => {
                if (error) {
                    next(error);
                } else {
                    res.json(response);
                }
            }
        );
    } catch(error) {
        next(error);
    }
}