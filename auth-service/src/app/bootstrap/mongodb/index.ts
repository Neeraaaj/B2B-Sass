import mongoose from "mongoose";

export async function dbConnection(){
    await mongoose
        .connect(process.env.DB_URL as string)
        .then(() => console.log("Connected"))
        .catch((error: Error) => console.log("DB connection Error: ", (error)?.message));
}