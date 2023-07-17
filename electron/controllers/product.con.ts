import ProductModel, { InProduct } from '../models/product';

export const createProduct = async (body: any) => {
  const productData = {
    title: body.title,
    price: body.price,
    payPeriodType: body.payPeriodType, //Weekly, monthly, or yearly
    periodicalPaymentAmount: body.periodicalPaymentAmount,
    desc: body.desc,
    image: body.image,
    createdAt: new Date(),
  };

  if (!productData.image) {
    delete productData.image;
  }

  const product = await new ProductModel(productData);
};
