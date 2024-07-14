import { Schema, Types, model } from 'mongoose';
import { requiredNumber, requiredString } from '../utils/mongoose-options';
import { Document } from 'mongoose';

export interface InBackup {
  name: string;
  path: string;
  deleteDuration: number;
  os: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BackupDocument = Document<unknown, {}, InBackup> &
  InBackup & {
    _id: Types.ObjectId;
  };

export const schema = new Schema<InBackup>({
  name: requiredString,
  os: { ...requiredString, enum: ['win32', 'linux'] },
  path: requiredString,
  deleteDuration: requiredNumber,
  createdAt: Date,
  updatedAt: Date,
});

const BackupModel = model('Backup', schema);
export default BackupModel;
