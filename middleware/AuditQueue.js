const { Queue } = require('bullmq');
const connection = require('../utils/RedisConnection');

const auditQueue = new Queue('audit-log-queue', { 
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
});

const logAction = async (action, userId, metadata) => {
    await auditQueue.add(action, {
        userId,
        ...metadata,
        timestamp: new Date().toISOString()
    }, {
        priority: action === 'LOW_STOCK_ALERT' ? 1 : 2
    });
};

module.exports = { logAction, auditQueue };