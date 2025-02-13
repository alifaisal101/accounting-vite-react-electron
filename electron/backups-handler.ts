import mongoose, { Types } from 'mongoose';
import { fetchBackups } from './controllers/backups.con';
import { InBackup } from './models/backup';
import { checkDirectoryAccess, checkFileAccess } from './utils/functions/dir';
import os from 'os';
import { errorLog, successLog, warnLog } from './utils/functions/log';
import { join, basename, dirname } from 'path';
import Datastore from '@seald-io/nedb';

import { mkdirSync, writeFileSync, existsSync, readFileSync, unlink } from 'fs';

const verifyBackupFile = (filePath: string) => {
  try {
    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read file content
    const fileContent = readFileSync(filePath, 'utf8');

    // Parse JSON content
    let jsonData = null;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(
        `Invalid JSON format in file ${filePath}: ${error.message}`
      );
    }

    // Example validation: Check for expected keys
    if (!Array.isArray(jsonData)) {
      throw new Error(
        `Invalid JSON structure in file ${filePath}: Expected an array.`
      );
    }

    // Additional checks based on your data structure

    console.log(`Validation successful for file: ${filePath}`);
    return true;
  } catch (error) {
    errorLog(`Validation failed for file ${filePath}: ${error.message}`);
    return false;
  }
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

    const filePath = join(absPath, backupStatus.fileName);
    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    return true;
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
  jsonBackupFile: string,
  date: string,
  backupId: Types.ObjectId,
  statusDb: any
) => {
  try {
    const statusDoc = {
      date,
      backupId,
      status: 'null',
      fileName: jsonBackupFile,
    };

    // try to back up

    try {
      // Ensure the connection is established
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Mongoose connection is not established.');
      }

      // Get list of all collections in the database
      const collections = await mongoose.connection.db.collections();

      // Object to store all data from all collections
      const backupData = {};

      // Iterate over each collection
      for (let collection of collections) {
        // Get collection name
        const collectionName = collection.collectionName;

        // Access the collection
        const dbCollection = mongoose.connection.collection(collectionName);

        // Fetch all documents from the collection
        const allDocuments = await dbCollection.find({}).toArray();

        // Store documents under collection name
        backupData[collectionName] = allDocuments;

        console.log(`Backup successful for collection '${collectionName}'. `);
      }
      // Write the documents to a JSON file
      const backupFilePath = `${backupPath}/${jsonBackupFile}`;
      // Write the data to a JSON file
      writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

      console.log(`Backup successful. Data saved to ${backupPath}`);
    } catch (err) {
      statusDoc.status = 'error';
      errorLog(err);
    }
    statusDoc.status = 'ok';
    await statusDb.insertAsync(statusDoc);
  } catch (error) {
    console.error(error);
    errorLog(`Error during database backup:`);
  }
};

const deleteOldBackups = async (
  statusDb: any,
  deleteDuration: number,
  backupDirAbsPath: string,
  currentDate: string
) => {
  const backupsFromStatusDb = await statusDb.findAsync({});
  for (let i = 0; i < backupsFromStatusDb.length; i++) {
    const backupRecord = backupsFromStatusDb[i];
    if (backupRecord.testItem || false) {
      continue;
    }
    const backupDate = new Date(backupRecord.date);

    const durationPassed = Math.floor(
      // @ts-ignore
      (new Date(currentDate) - backupDate) / (1000 * 60 * 60 * 24)
    );

    if (durationPassed >= deleteDuration) {
      statusDb
        .removeAsync({ _id: backupRecord._id }, {})
        .then(() => {
          successLog(`Deleted backup with id: ${backupRecord._id}`);
        })
        .catch((err) => {
          errorLog(err);
        });
      const absPathJsonDb = join(backupDirAbsPath, backupRecord.fileName);
      unlink(absPathJsonDb, (err) => {
        if (err) {
          console.error(`Error deleting file ${absPathJsonDb}: ${err.message}`);
          return;
        }
        console.log(`File ${absPathJsonDb} has been deleted successfully`);
      });
    }
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

        const jsonBackupFile = `${backup._id}_${currentDate}.json`;

        const logStart = `[Backup: ${backup._id}]:`;

        if (backup.os !== os.platform()) {
          warnLog(
            `${logStart} has os: ${
              backup.os
            }. Mismatch from System's os: ${os.platform()}. Backup won't happen.`
          );
          continue;
        }

        const pathAccessible = await checkDirectoryAccess(backup.path);
        if (!pathAccessible) {
          throw new Error(
            `${logStart} Failed to access root directory. Path ${backup.path} is either not found, or does not have read/write permissions.`
          );
        }

        // If backup DIR doesn't exist, create it
        const backupDirExists = await checkDirectoryAccess(backupDirAbsPath);
        if (!backupDirExists) {
          warnLog(
            `${logStart} Failed to access backup directory. Path ${backupDirAbsPath} is either not found, or does not have read/write permissions. It will be created now.`
          );
          await createBackupDir(backupDirAbsPath);
        }

        // If status DB doesn't exist, create it
        const backupStatusFileExists = await checkFileAccess(
          backupStatusFilenameAbsPath
        );
        if (!backupStatusFileExists) {
          warnLog(
            `${logStart} Failed to find backup status file. File ${backupStatusFilename} is either not found, or does not have read/write permissions. It will be created now.`
          );
          await createBackupStatusFile(backupStatusFilenameAbsPath);
        }

        // Link the the NeDB to statusDb constant
        const statusDb = new Datastore({
          filename: backupStatusFilenameAbsPath,
        });

        await statusDb.loadDatabaseAsync();
        // Check if the JSON backup for today exists, if not, execute backupExec() to pull the data and backup for today
        const checkJSONStatus = await checkBkStatus(
          statusDb,
          currentDate,
          backup,
          backupDirAbsPath
        );

        if (!checkJSONStatus) {
          await backupExec(
            backupDirAbsPath,
            jsonBackupFile,
            currentDate,
            backup._id,
            statusDb
          );
        }

        // If the deleteDuration is not 0 (0 means don't delete old backups) then check the old backups and delete them
        if (backup.deleteDuration !== 0) {
          await deleteOldBackups(
            statusDb,
            backup.deleteDuration,
            backupDirAbsPath,
            currentDate
          );
        }
      }
    })
    .catch((err) => {
      errorLog(err);
    });
};
