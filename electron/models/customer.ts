import { ObjectId, Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredString,
  unRequiredString,
} from '../utils/objects/mongoose-options';
import { InPurchase } from './purchase';

// Document interface
export interface InCustomer {
  name: string;
  phoneNumber: string;
  createdAt: Date;
  purchasesIds?: ObjectId[];
  notes?: string;
}

export interface InCustomerWithPurchases extends InCustomer {
  purchases: InPurchase[];
  unFulfilledPayment?: boolean;
  earliestPaymentDate?: Date;
}

const schema = new Schema<InCustomer>({
  name: requiredString,
  phoneNumber: requiredString,
  purchasesIds: {
    required: true,
    type: [
      {
        ref: 'Purchase',
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
  },
  createdAt: requiredDate,
  notes: unRequiredString,
});

const CustomerModel = model('Customer', schema);
export default CustomerModel;
