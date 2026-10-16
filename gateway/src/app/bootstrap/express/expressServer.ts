import express, { Router } from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { handleExpressError } from '../exceptions/handleExpressError';
import { apiV1Routes } from '../../../routes/apiV1';


export function expressServer(app: Express, PORT: number) {
    const router = Router();

    app.use(cors({
        origin: process.env.FRONT_APP_URL,
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/assets', express.static(path.join(process.cwd(), 'public')));
    app.use('/', router);
    app.use(handleExpressError);
    
    // Error handler goes LAST so it catches errors from everything above
    
    router.get('/', async (req: Request, res: Response) => {
        res.json({ message: 'Server is up' });
    });

    apiV1Routes(app, router)
    
    app.listen(PORT, () => {
        console.log(`Express server is running at http://localhost:${PORT}`);
    });
}
