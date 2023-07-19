import { Schema, model } from 'mongoose';
import {
  requiredDate,
  requiredNumber,
  requiredString,
} from '../utils/mongoose-options';

// Document interface
export interface InProduct {
  title: string;
  price: number;
  payPeriodType: string; //Weekly, monthly, or yearly
  upFrontPaymentAmount: number;
  periodicalPaymentAmount: number;
  desc: string;
  image?: Buffer;
  createdAt: Date;
}

// Schema
const schema = new Schema<InProduct>({
  title: requiredString,
  price: requiredNumber,
  payPeriodType: requiredString,
  upFrontPaymentAmount: requiredNumber,
  periodicalPaymentAmount: requiredNumber,
  desc: requiredString,
  image: { type: Buffer, required: false },
  createdAt: requiredDate,
});

const ProductModel = model('Product', schema);
export default ProductModel;
