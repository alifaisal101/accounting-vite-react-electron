import { Schema, model } from 'mongoose';

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
  title: { type: String, required: true },
  price: { type: Number, required: true },
  payPeriodType: { type: String, required: true },
  upFrontPaymentAmount: { type: Number, required: true },
  periodicalPaymentAmount: { type: Number, required: true },
  desc: { type: String, required: true },
  image: { type: Buffer, required: false },
  createdAt: { type: Date, required: true },
});

const ProductModel = model('Product', schema);
export default ProductModel;
