import type { NextFunction, Request, Response } from 'express';

// Express recognises an error handler ONLY by its 4 parameters.
export function handleExpressError(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('[express error]', err);
    const status = err?.status ?? 500;
    res.status(status).json({
        success: false,
        message: err?.message ?? 'Internal Server Error',
    });
}
