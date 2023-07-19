import { ObjectId, Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredNumber,
  requiredString,
} from '../utils/mongoose-options';

export interface InPurchasedProduct {
  productId: ObjectId;
  title: string;
  price: number;
  payPeriodType: string; //Weekly, monthly, or yearly
  upFrontPaymentAmount: number;
  periodicalPaymentAmount: number;
  desc: string;
  createdAt: Date;
}

// Document interface
export interface InPurchase {
  purchasedProduct: InPurchasedProduct;
  debt: number;
  purchaseDate: string;
  payStartDate: Date;
}

const schema = new Schema<InPurchase>({
  purchasedProduct: {
    required: true,
    type: {
      productId: {
        ref: 'Product',
        type: Schema.Types.ObjectId,
        required: true,
      },
      title: requiredString,
      price: requiredNumber,
      payPeriodType: requiredString,
      upFrontPaymentAmount: requiredNumber,
      periodicalPaymentAmount: requiredNumber,
      desc: requiredString,
      createdAt: requiredDate,
    },
  },
  debt: requiredNumber,
  payStartDate: requiredDate,
});

const PurchaseModel = model('Purchase', schema);
export default PurchaseModel;
