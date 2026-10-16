import {UserService} from "@/services/userService";

export async function verifyEmailController(props: {email: string, otpCode: string}){
    try{
        const {email, otpCode} = props;
        const userService = UserService.getInstance();
        const userExists = await userService.findUserByEmail(email);

        if(!userExists){
            throw new Error("User not found");
        }

        if(userExists){
            const existingOtpCode = userExists.otpCode;

            if(parseInt(existingOtpCode) === parseInt(otpCode)){
                await userService.validateUserEmail(email);
                return {
                    message: "Email verified successfully",
                    success: true
                };
            } else {
                return {
                    message: "Invalid OTP code",
                    success: false
                }
            }
        } else {
            return {
                message: "User email not found",
                success: false
            }
        }
    } catch (err) {
        throw err;
    }
}