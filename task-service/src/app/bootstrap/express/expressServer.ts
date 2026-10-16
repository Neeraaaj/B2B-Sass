import express, { Router } from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { handleExpressError } from '../exceptions/handleExpressError';
import { allTask } from '../grpc/gRPCClient';

export function expressServer(app: Express, PORT: number) {
    const router = Router();

    app.use(cors({
        origin: process.env.FRONT_APP_URL,
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/assets', express.static(path.join(process.cwd(), 'public')));

    router.get('/', async (req: Request, res: Response) => {
        res.json({ message: 'Server is up' });
    });

    app.use('/', router);

    // Error handler goes LAST so it catches errors from everything above
    app.use(handleExpressError);

    app.get('/tasks', async(req: Request, res: Response) => {
        const tasks = await allTask()
        res.json(tasks);
    })

    app.listen(PORT, () => {
        console.log(`Express server is running at http://localhost:${PORT}`);
    });
}
