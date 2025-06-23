import "dotenv/config";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { Client } from 'pg';
import { Request, Response } from "express";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const client = new Client({
  connectionString: connectionString
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Database connection error', err.stack));

// Example API endpoint using the client


export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });