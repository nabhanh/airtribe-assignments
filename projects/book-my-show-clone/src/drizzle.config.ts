import type { Config } from 'drizzle-kit';
import 'dotenv';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME as string
  }
} satisfies Config;
