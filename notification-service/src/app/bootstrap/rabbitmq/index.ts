import amqp from "amqplib";
import { sendEmail } from "../../../email/emailNotification";

let channel: amqp.Channel;

export async function connectRabbitMQ(): Promise<void>{
    const rabbitUrl = process.env.RABBITMQ_URL;

    console.log("RabbitMQ URL: ", rabbitUrl);

    if(!rabbitUrl){
        console.log("RabbitMQ Error: RabbitMQ_URL environment variable is missing");
        process.exit(1);
    }

    try{
        console.log("Connecting to RabbitMQ...");
        const connection = await amqp.connect(rabbitUrl);

        connection.on("error", (err) => {
            console.error("RabbitMQ connection runtime error: ", err.message);
        })

        connection.on("close", () => {
            console.error("RabbitMQ connection cloased! Exiting application...");
            process.exit(1);
        })

        channel = await connection.createChannel();

        await channel.assertExchange("user.events", "topic", {
            durable: true,
        });

        // define a queue
        const queue = await channel.assertQueue("email.notifications", {
            durable: true
        });

        // bind a event to the queue
        await channel.bindQueue(queue.queue, "user.events", "user.created");

        channel.consume(queue.queue, async(msg:any) => {
            if (!msg) return;

            const data = JSON.parse(msg.content.toString());
            console.log("Sending email: ", data.email);

            await sendEmail(data?.email, data?.otpCode);

            channel.ack(msg);
        });
        console.log("RabbitMQ connected and exchange asserted.");
    }catch(err: any){
        console.error("Failed to initialize RabbitMQ: ", err?.message || err);
        process.exit(1);
    }
}