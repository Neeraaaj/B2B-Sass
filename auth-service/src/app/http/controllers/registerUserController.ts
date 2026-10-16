import { NextFunction, Request, Response } from "express";
import { userInputSchema } from "./userDTO";
import { UserService } from "@/services/userService";
import z from "zod";
import { hashPassword } from "@/helper/userPassword";
import { generateOTP } from "@/helper/generateOTP";
import {publishEvent} from "@/app/bootstrap/rabbitmq/events";

// export async function registerUser(req: Request, res: Response, next: NextFunction){
//     try{
//         const email = req.body?.email;
//         const password = req.body?.password;

//         const result = userInputSchema.safeParse({email, password});

//         if(!result.success){
//             return res.status(422).json({
//                 message: "Validation Failed",
//                 validationErrors: z.flattenError(result.error)
//             });
//         }

//         const userRepo = UserService.getInstance()

//         const otpCode = generateOTP(7)
//         const hashPwd = await hashPassword(password)

//         const user = await userRepo.registerUser({email, otpCode, hashPwd})
        
//         publishEvent("user.registered", { userId: user._id, email: user.email, otpCode });
        
//         return res.json({message: "Your account was created successfully", user});
//     }catch(err){
//         next(err)
//     }
// }


export async function registerUserController(props: {email: string, password: string}){
    try{
        const {email, password} = props;
        const result = userInputSchema.safeParse({email, password});

        if(!result.success){
            throw{
                message: "Validation Failed",
                validationErrors: z.flattenError(result.error)
            };
        }

        const userRepo = UserService.getInstance()

        const otpCode = generateOTP(7)
        const hashPwd = await hashPassword(password)

        const user = await userRepo.registerUser({email, otpCode, hashPwd})

        publishEvent("user.created", { userId: user._id, email: user.email, otpCode });
    
        return {message: "we sent an email with your OTP code, use the otp to verify your account", user};
    } catch(err){
        throw err;
    }
}