const { Worker } = require('bullmq');
const connection = require('../utils/RedisConnection');
const prisma = require('../db/db_config');

const worker = new Worker('audit-log-queue', async (job) => {
  const { name, data } = job;

  const auditData = {
    action: name,
    userId: String(data.userId || 'system'), 
    meta: {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
    }
  };

  try {
    await prisma.auditLog.create({ data: auditData });
    console.log(`Logged: ${name} for user ${auditData.userId}`);
  } catch (error) {
    console.error(`Failed to log ${name}:`, error.message);
    throw error; 
  }
}, { 
  connection,
  concurrency: 3 
});
worker.on('completed', (job) => {
  console.log(`Done: ${job.name} (ID: ${job.id})`);
});

worker.on('failed', (job, err) => {
  console.error(`Failed job ${job.id}:`, err.message);
});

process.on('SIGTERM', async () => {
  await worker.close();
});