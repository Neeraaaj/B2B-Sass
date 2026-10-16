import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
});


export async function sendEmail(receiverEmail: string, otpCode: number) {
    const info = await transporter.sendMail({
        from: 'From B2B SaaS APP',
        to: receiverEmail,
        subject: 'Your OTP Code',
        text: `Hello use this code to verify your email address:  ${otpCode}`,
        html: "<b>More information here....</b>",
    }).catch((error: any) => console.log("Error while sending mail:", error))
}