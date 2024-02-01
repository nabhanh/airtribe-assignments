import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv';
import * as schema from './schema';

const sql = postgres(process.env.DB_URL as string, { max: 1 });
const db = drizzle(sql, { schema });
export default db;
