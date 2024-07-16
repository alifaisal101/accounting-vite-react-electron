import { Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredNumber,
  requiredString,
  unRequiredString,
} from '../utils/objects/mongoose-options';

// Document interface
export interface InPrintSettings {
  shopName: string;
  firstPhoneNumber?: string;
  secondPhoneNumber?: string;
  firstAddress?: string;
  secondAddress?: string;
  image?: Buffer;
}

// Schema
const schema = new Schema<InPrintSettings>({
  shopName: requiredString,
  firstPhoneNumber: unRequiredString,
  secondPhoneNumber: unRequiredString,
  firstAddress: unRequiredString,
  secondAddress: unRequiredString,
  image: {
    type: Buffer,
    required: false,
  },
});

const PrintSettingsModel = model('printsettings', schema);
export default PrintSettingsModel;
