import { Schema, Types, model } from 'mongoose';
import { requiredNumber, requiredString } from '../utils/mongoose-options';
import { Document } from 'mongoose';

export interface InBackup {
  name: string;
  path: string;
  deleteDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BackupDocument = Document<unknown, {}, InBackup> &
  InBackup & {
    _id: Types.ObjectId;
  };

export const schema = new Schema<InBackup>({
  name: requiredString,
  path: requiredString,
  deleteDuration: requiredNumber,
  createdAt: Date,
  updatedAt: Date,
});

const BackupModel = model('Backup', schema);
export default BackupModel;
