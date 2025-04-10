const prisma  = require('../db/db_config');

async function logAudit(action, userId, meta = {}) {
  await prisma.auditLog.create({
    data: {
      action,
      userId,
      meta,
    },
  });
}

module.exports = logAudit;
