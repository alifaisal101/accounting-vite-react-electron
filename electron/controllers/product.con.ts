import ProductModel, { InProduct } from '../models/product';
import { arrayBufferToJson, jsonToBuffer } from '../utils/functions/data';
import { mappedPeriodType } from '../utils/functions/locale';

export const createProduct = async (product_body: InProduct) => {
  const product_data = {
    ...product_body,
    createdAt: new Date(),
  };

  if (!product_data?.image) {
    delete product_data.image;
  } else {
    // @ts-ignore
    product_data.image = jsonToBuffer(product_data.image);
  }

  const product = new ProductModel(product_data);

  // @ts-ignore
  const result = { ...(await product.save())._doc };

  result._id = result._id.toString();
  result.payPeriodType = mappedPeriodType(result.payPeriodType);

  if (result.image) {
    // @ts-ignore
    result.image = arrayBufferToJson(result.image);
  }

  return result;
};

export const fetchProducts = async () => {
  const result = await ProductModel.find();
  const products = [];

  for (let i = 0; i < result.length; i++) {
    //@ts-ignore
    const product = { ...result[i]._doc, _id: result[i]._id.toString() };
    product.payPeriodType = mappedPeriodType(product.payPeriodType);

    if (product.image) {
      //@ts-ignore
      product.image = arrayBufferToJson(product.image);
    }
    //@ts-ignore
    products.push(product);
  }

  return products;
};

export const deleteProduct = async (_id: string) => {
  return await ProductModel.deleteOne({ _id });
};
