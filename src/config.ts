import dotenv from 'dotenv';
dotenv.config();

export const config = {
    server: {
        port: process.env.PORT,
        host: process.env.HOST,
        protocol: 'http'
    }
}