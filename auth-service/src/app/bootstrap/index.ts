import express from 'express';
import { expressServer } from './express/expressServer';
import { grpcServer } from './grpc/grpcServer';
import { dbConnection } from './mongodb';
import { connectRabbitMQ } from './rabbitmq';

export async function bootstrap() {
    await dbConnection();
    await connectRabbitMQ();
    grpcServer();
}
