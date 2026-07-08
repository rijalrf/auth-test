import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { createApp } from './app.js';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const app = createApp(prisma);
const PORT = parseInt(process.env.PORT || '3000', 10);

async function main() {
  await prisma.$connect();
  console.log('✅ Database connected');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM — shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT — shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
