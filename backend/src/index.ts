import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// API Test Connecting
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Book Illustration Studio API is running' });
});

app.listen(port, () => {
  console.log(`[Backend] Server is running on http://localhost:${port}`);
});