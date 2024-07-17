import { Types } from 'mongoose';
import { fetchBackups } from './controllers/backups.con';
import { InBackup } from './models/backup';
import { checkDirectoryAccess, checkFileAccess } from './utils/functions/dir';
import os from 'os';
import { errorLog, successLog, warnLog } from './utils/functions/log';
import { join, basename, dirname } from 'path';
import Datastore from '@seald-io/nedb';

import { exec } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { MONGODB_URI } from './config';

import { schedule } from 'node-cron';
import { MongoTools, MTOptions, MTCommand } from 'node-mongotools';

const verifyBackupFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    // Construct the command to verify the backup file
    const command = `mongorestore --dryRun --archive=${filePath}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      // Check the output for errors or success messages
      if (stderr) {
        // If there's any error message in stderr, the file might be corrupt
        reject(new Error(`Backup file ${filePath} is corrupt: ${stderr}`));
      } else {
        // If stdout is empty and no error, file is valid
        resolve(`Backup file ${filePath} is valid.`);
      }
    });
  });
};

const checkBkStatus = async (
  statusDb: any,
  currentDate: string,
  backup: InBackup & { _id: Types.ObjectId },
  absPath: string
) => {
  try {
    const backupStatus = await statusDb.findOneAsync({ date: currentDate });
    if (!backupStatus) {
      return false;
    }

    if (backupStatus.status !== 'ok') {
      return false;
    }

    const databaseBackupFileRAWAbsPath = join(absPath, backupStatus.fileName);
    return await verifyBackupFile(databaseBackupFileRAWAbsPath);
  } catch (err) {
    errorLog(err);
    return false;
  }
};

const createBackupStatusFile = async (filePath: string) => {
  try {
    // Extract the directory path and file name from filePath
    const directoryPath = dirname(filePath);
    const fileName = basename(filePath);

    // Create an empty text file
    writeFileSync(join(directoryPath, fileName), '');

    successLog(
      `Empty backup-status-nedb file "${fileName}" created successfully at "${directoryPath}".`
    );
  } catch (err) {
    errorLog(`Error creating empty text file: ${err}`);
  }
};

const createBackupDir = async (dirPath: string) => {
  try {
    mkdirSync(dirPath, { recursive: false });

    successLog(`Dir "${dirPath}" created successfully at "${dirPath}".`);
  } catch (err) {
    errorLog(`Error creating backup dir: ${err}`);
  }
};

const backupExec = async (
  backupPath: string,
  dumbFileName: string,
  date: string,
  backupId: Types.ObjectId,
  statusDb: any
) => {
  try {
    const statusDoc = {
      date,
      backupId,
      status: 'null',
      fileName: dumbFileName,
    };

    const mongoTools = new MongoTools();
    const result = await mongoTools.mongodump({
      uri: MONGODB_URI,
      path: backupPath,
      fileName: dumbFileName,
    });
    // // Construct the mongodump command
    // const command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}" --gzip --archive="${dumbFileName}"`;

    // // Execute the mongodump command
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     errorLog(`Error executing mongodump: ${error.message}`);
    //     statusDoc.status = 'error';
    //     return;
    //   }
    //   if (stderr) {
    //     errorLog(`mongodump stderr: ${stderr}`);
    //     statusDoc.status = 'stderr';
    //     return;
    //   }
    //   statusDoc.status = 'ok';
    //   console.log(`mongodump stdout: ${stdout}`);
    //   console.log(`Database backup completed successfully to ${backupPath}`);
    // });

    await statusDb.insertAsync(statusDoc);
  } catch (error) {
    console.error(error);
    errorLog(`Error during database backup:`);
  }
};

export const backupHandler = () => {
  // Handle backups
  fetchBackups()
    .then(async (backups) => {
      if (!backups || !backups?.length) return;

      for (let i = 0; i < backups.length; i++) {
        const backup: InBackup & { _id: Types.ObjectId } = backups[i];

        // Format the date in YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0];

        const backupDir = `AlMuhandis_${backup._id}`;
        const backupDirAbsPath = join(backup.path, backupDir);

        const backupStatusFilename = `status_${backup._id}.nedb`;
        const backupStatusFilenameAbsPath = join(
          backupDirAbsPath,
          backupStatusFilename
        );

        const dumbFileName = `${backup._id}_${currentDate}.dumb`;

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
            `${logStart} Failed to access root directory. Path ${backup.path} is either not found, or does not have read/write permissions.`
          );
        }

        const backupDirExists = await checkDirectoryAccess(backupDirAbsPath);
        const statusDb = new Datastore({ filename: backupStatusFilename });

        if (backupDirExists) {
          const backupStatusFileExists = await checkFileAccess(
            backupStatusFilenameAbsPath
          );

          if (backupStatusFileExists) {
            try {
              await statusDb.loadDatabaseAsync();
            } catch (err) {
              return errorLog(err);
            }
            if (
              !(await checkBkStatus(
                statusDb,
                currentDate,
                backup,
                backupDirAbsPath
              ))
            ) {
              await backupExec(
                backupDirAbsPath,
                dumbFileName,
                currentDate,
                backup._id,
                statusDb
              );
            }
          } else {
            warnLog(
              `${logStart} Failed to find backup status file. File ${backupStatusFilename} is either not found, or does not have read/write permissions. It will be created now.`
            );
            await createBackupStatusFile(backupStatusFilenameAbsPath);
            await backupExec(
              backupDirAbsPath,
              dumbFileName,
              currentDate,
              backup._id,
              statusDb
            );
          }
        } else {
          warnLog(
            `${logStart} Failed to access backup directory. Path ${backupDirAbsPath} is either not found, or does not have read/write permissions. It will be created now.`
          );
          await createBackupDir(backupDirAbsPath);
          await createBackupStatusFile(backupStatusFilenameAbsPath);
          await backupExec(
            backupDirAbsPath,
            dumbFileName,
            currentDate,
            backup._id,
            statusDb
          );
        }

        schedule('*/5 * * * *', async () => {
          await backupExec(
            backupDirAbsPath,
            dumbFileName,
            currentDate,
            backup._id,
            statusDb
          );
        });
      }
    })
    .catch((err) => {
      errorLog(err);
    });
};
