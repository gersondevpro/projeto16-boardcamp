import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const connectionDB = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: "postgres",
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});