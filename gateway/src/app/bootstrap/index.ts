import express from 'express';
import { expressServer } from './express/expressServer';

export function bootstrap() {
    const PORT = Number(process.env.PORT ?? 4000);
    const GRPC_PORT = Number(process.env.GRPC_PORT ?? 50051);

    const app = express();
    expressServer(app, PORT);
}
