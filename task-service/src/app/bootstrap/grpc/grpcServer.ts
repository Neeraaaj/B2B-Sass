import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import crypto from "crypto";
import path from "path";
import { title } from "process";


export const PROTO_PATH=path.join("/", "proto", "agent.proto");
const PORT = process.env.PORT || 50051

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const tasks = proto.tasks;

function randomTask(){
    const titles = [
        "write blog post",
        "build gRPC system",
        "learn Docker",
        "deploy mircoservices",
        "Fix bugs",
        "study system design",
        "Read architecture docs",
        "Improve backend API",
        "Optimize database",
        "Refactor Services"
    ];

    return {
        id: crypto.randomUUID(),
        title : titles[Math.floor(Math.random() * titles.length)],
        completed: Math.random() > 0.5
    };
}

async function GetTasks(call: any, callback: any){
    try{
        const generatedTasks = Array.from({length: 5}, randomTask);

        callback(null, {
            tasks: generatedTasks,
        });
    }catch(err){
        callback(err, null);
    }
}


export function grpcServer(){
    const server = new grpc.Server();

    server.addService(tasks.TaskService.service, {
        GetTasks
    });

    server.bindAsync(
        `0.0.0.0:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if(error){
                console.error(`Server failed to bind: ${error.message}`);
                return;
            }
            console.log(`Task sevrer runnning on port: ${port}`)
        }
    )
}