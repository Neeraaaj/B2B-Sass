import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import crypto from "crypto";
import path from "path";
import { title } from "process";
import { PROTO_PATH } from "./grpcServer";


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const tasks = proto.tasks;


const client = new tasks.TaskService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);


export function allTask(){
    return new Promise((resolve, reject) => {
        client.GetTasks({}, (err: any, response: any) => {
            if(err){
                console.error(err);
                return;
            }
            resolve(response)
        });
    });
}