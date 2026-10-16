import {Router} from 'express';
import { registerUser, verifyUserEmail } from '../../app/grpc/grPCAuthClient';

export function authRoutes(router: Router){
    router.post('/register', registerUser)
    router.post('/verify-email', verifyUserEmail)
    return router
}