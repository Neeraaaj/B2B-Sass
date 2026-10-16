import express from 'express';
import { expressServer } from './express/expressServer';
import { grpcServer } from './grpc/grpcServer';
import { connectRabbitMQ } from './rabbitmq';

export async  function bootstrap() {
    await connectRabbitMQ();
    grpcServer();
}
