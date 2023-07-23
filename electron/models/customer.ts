import { ObjectId, Schema, model } from 'mongoose';
import { requiredDate, requiredString } from '../utils/mongoose-options';

// Document interface
export interface InCustomer {
  name: string;
  phoneNumber: string;
  createdAt: Date;
  purchasesIds?: ObjectId[];
}

const schema = new Schema<InCustomer>({
  name: requiredString,
  phoneNumber: requiredString,
  purchasesIds: [
    {
      required: true,
      type: [
        {
          ref: 'Purchase',
          required: true,
          type: Schema.Types.ObjectId,
        },
      ],
    },
  ],
  createdAt: requiredDate,
});

const CustomerModel = model('Customer', schema);
export default CustomerModel;
