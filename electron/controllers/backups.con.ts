import { Types } from 'mongoose';
import BackupModel, { InBackup } from '../models/backup';
import { convertIdInRecords } from '../utils/functions/data';

export const fetchBackups = async () => {
  try {
    const backups = convertIdInRecords(await BackupModel.find().lean());
    return backups;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createBackup = async (backup: InBackup) => {
  try {
    const result = await BackupModel.create(backup);

    //@ts-ignore
    const { _doc } = result;
    _doc._id = _doc._id.toString();

    return _doc;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateBackup = async (
  modifiedBackup: InBackup & { _id: Types.ObjectId }
) => {
  try {
    const result = BackupModel.findByIdAndUpdate(
      modifiedBackup._id,
      modifiedBackup
    );

    //@ts-ignore
    const { _doc } = result;
    _doc._id = _doc._id.toString();

    return _doc;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteBackup = async (backupId: Types.ObjectId) => {
  try {
    const result = await BackupModel.findByIdAndDelete(backupId);
    //@ts-ignore
    const { _doc } = result;
    _doc._id = _doc._id.toString();

    return _doc;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
