import path from 'node:path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Reads a .proto file at runtime and turns it into a JS object gRPC can use.
export function loadProto(fileName: string) {
    const PROTO_PATH = path.join(process.cwd(), 'proto', fileName);

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,   // keep user_id as user_id (not userId)
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition) as any;
}
