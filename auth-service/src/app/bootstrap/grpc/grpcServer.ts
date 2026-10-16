import { registerUserController } from "@/app/http/controllers/registerUserController";
import { verifyEmailController } from "@/app/http/controllers/VerifyEmailController";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import crypto from "crypto";
import path from "path";
import { title } from "process";


export const PROTO_PATH=path.join("/", "proto", "auth.proto");
const PORT = process.env.PORT || 50053

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const auth = proto.auth;

async function registerUser(call: any, callback: any){
    try{
        const response = await registerUserController({
            email: call?.request?.email,
            password: call?.request?.password,
        })

        callback(null, response)
    }catch(error){
        callback(
        {
            code: grpc.status.INVALID_ARGUMENT,
            message: (error as Error).message || "Registration failed",
        },
        null
        );
    }
}


async function verifyUserEmail(call: any, callback: any){
    try{
        const response = await verifyEmailController({
            email: call?.request?.email,
            otpCode: call?.request?.otpCode,
        })

        callback(null, response)
    }catch(error){
        callback(
        {
            code: grpc.status.INVALID_ARGUMENT,
            message: (error as Error).message || "Email verification failed",
        },
        null
        );
    }
}


export function grpcServer(){
    const server = new grpc.Server();

    server.addService(auth.AuthService.service, {
        RegisterUser: registerUser,
        VerifyUserEmail: verifyUserEmail
    });

    server.bindAsync(
        `0.0.0.0:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if(error){
                console.error(`Server failed to bind: ${error.message}`);
                return;
            }
            console.log(`Auth sevrer runnning on port: ${port}`)
        }
    )
}