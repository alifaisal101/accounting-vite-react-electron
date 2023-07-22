import { ObjectId, Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredNumber,
  requiredString,
} from '../utils/mongoose-options';

export interface InPurchasedProduct {
  productId?: ObjectId;
  title: string;
  price: number;
}

export interface InPurchasePayment {
  amount: number;
  date: Date;
  paidUp: number;
  status: string; // unpaid, partial, full
}

// Document interface
export interface InPurchase {
  purchasedProducts: InPurchasedProduct[];
  payments: InPurchasePayment[];
  debt: number;
  totalCost: number;
  purchaseDate: Date;
  payStartDate: Date;
  upFrontPaymentAmount: number;
  payPeriodType: string;
  periodicalPaymentAmount: number;
}

const schema = new Schema<InPurchase>({
  purchasedProducts: {
    type: [
      {
        productId: {
          ref: 'Product',
          type: Schema.Types.ObjectId,
          required: false,
        },
        title: requiredString,
        price: requiredNumber,
      },
    ],
    required: true,
  },
  payments: {
    type: [
      {
        amount: requiredNumber,
        date: requiredDate,
        paidUp: requiredNumber,
        status: requiredString,
      },
    ],
    required: true,
  },
  debt: requiredNumber,
  totalCost: requiredNumber,
  purchaseDate: requiredDate,
  payStartDate: requiredDate,
  upFrontPaymentAmount: requiredNumber,
  payPeriodType: requiredString,
  periodicalPaymentAmount: requiredNumber,
});

const PurchaseModel = model('Purchase', schema);
export default PurchaseModel;
