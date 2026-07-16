'use strict';

const fs = require('fs');
const path = require('path');

function removeIfPresent(filePath) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function commitFileTransaction(writes) {
  const targets = writes.map(({ targetPath }) => path.resolve(targetPath));
  if (new Set(targets).size !== targets.length) {
    throw new Error('Generated file transaction contains duplicate targets.');
  }

  const transactionId = `${process.pid}-${Date.now()}`;
  const records = writes.map(({ targetPath, content }, index) => {
    const resolvedTarget = path.resolve(targetPath);
    const directory = path.dirname(resolvedTarget);
    const basename = path.basename(resolvedTarget);
    return {
      targetPath: resolvedTarget,
      content,
      directory,
      tempPath: path.join(directory, `.${basename}.sitegen-${transactionId}-${index}.tmp`),
      backupPath: path.join(directory, `.${basename}.sitegen-${transactionId}-${index}.bak`),
      movedOriginal: false,
      replaced: false
    };
  });

  try {
    records.forEach((record) => {
      fs.mkdirSync(record.directory, { recursive: true });
      fs.writeFileSync(record.tempPath, record.content, { encoding: 'utf8', flag: 'wx' });
    });

    records.forEach((record) => {
      if (fs.existsSync(record.targetPath)) {
        fs.renameSync(record.targetPath, record.backupPath);
        record.movedOriginal = true;
      }
      fs.renameSync(record.tempPath, record.targetPath);
      record.replaced = true;
    });

  } catch (error) {
    const rollbackErrors = [];

    [...records].reverse().forEach((record) => {
      try {
        if (record.replaced) removeIfPresent(record.targetPath);
        if (record.movedOriginal && fs.existsSync(record.backupPath)) {
          fs.renameSync(record.backupPath, record.targetPath);
        }
        removeIfPresent(record.tempPath);
      } catch (rollbackError) {
        rollbackErrors.push(`${record.targetPath}: ${rollbackError.message}`);
      }
    });

    if (rollbackErrors.length) {
      error.message += ` Rollback errors: ${rollbackErrors.join('; ')}`;
    }
    throw error;
  }

  records.forEach((record) => {
    try {
      removeIfPresent(record.backupPath);
    } catch {
      // A leftover backup is safer than rolling back an otherwise successful transaction.
    }
  });
}

module.exports = { commitFileTransaction };
