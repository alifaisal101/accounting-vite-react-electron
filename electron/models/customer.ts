import { ObjectId, Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredNumber,
  requiredString,
  unRequiredString,
} from '../utils/mongoose-options';

// Document interface
export interface InCustomer {
  name: string;
  phoneNumber: number;
  email?: string;
  createdAt: Date;
  purchasesIds?: ObjectId[];
}

const schema = new Schema<InCustomer>({
  name: requiredString,
  phoneNumber: requiredNumber,
  email: unRequiredString,
  purchasesIds: [
    {
      required: false,
      type: {
        ref: 'Purchase',
        required: true,
        type: Schema.Types.ObjectId,
      },
    },
  ],
  createdAt: requiredDate,
});

const CustomerModel = model('Customer', schema);
export default CustomerModel;
