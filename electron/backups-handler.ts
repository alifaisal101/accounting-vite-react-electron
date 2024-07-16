import { Types } from 'mongoose';
import { fetchBackups } from './controllers/backups.con';
import { InBackup } from './models/backup';
import { checkDirectoryAccess } from './utils/functions/dir';
import os from 'os';
import { errorLog, warnLog } from './utils/functions/log';

export const backupHandler = () => {
  // Handle backups
  fetchBackups()
    .then(async (backups) => {
      if (!backups || !backups?.length) return;

      for (let i = 0; i < backups.length; i++) {
        const backup: InBackup & { _id: Types.ObjectId } = backups[i];
        const backupDIR = `AlMuhandis_${backup._id}`;
        const backupStatus = `status_${backup._id}`;

        const logStart = `[Backup: ${backup._id}]:`;

        if (backup.os !== os.platform()) {
          return warnLog(
            `${logStart} has os: ${
              backup.os
            }. Mismatch from System's os: ${os.platform()}. Backup won't happen.`
          );
        }

        const pathAccessible = await checkDirectoryAccess(backup.path);
        if (!pathAccessible) {
          throw new Error(
            `${logStart} Failed to access directory. Path ${backup.path} which is either not found, or does not have read/write permissions.`
          );
        }
      }
    })
    .catch((err) => {
      errorLog(err);
    });
};
