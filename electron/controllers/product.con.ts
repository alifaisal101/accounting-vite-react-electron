import ProductModel, { InProduct } from '../models/product';
import { mappayPeriodType } from '../utils/locale';

export const createProduct = async (product_body: InProduct) => {
  const product_data = {
    ...product_body,
    createdAt: new Date(),
  };

  if (!product_data?.image) {
    delete product_data.image;
  } else {
    // @ts-ignore
    product_data.image = Buffer.from(JSON.parse(product_data.image).data);
  }

  const product = new ProductModel(product_data);

  // @ts-ignore
  const result = { ...(await product.save())._doc };

  result._id = result._id.toString();
  result.payPeriodType = mappayPeriodType(result.payPeriodType);

  if (result.image) {
    const imageJSON = JSON.stringify({
      name: 'product_image',
      data: Array.from(new Uint8Array(result.image)),
    });

    // @ts-ignore
    result.image = imageJSON;
  }

  return result;
};

export const fetchProducts = async () => {
  const result = await ProductModel.find();
  const products = [];

  for (let i = 0; i < result.length; i++) {
    //@ts-ignore
    const product = { ...result[i]._doc, _id: result[i]._id.toString() };
    product.payPeriodType = mappayPeriodType(product.payPeriodType);

    if (product.image) {
      //@ts-ignore
      product.image = JSON.stringify({
        name: 'product_image',
        data: Array.from(new Uint8Array(product.image)),
      });
    }
    products.push(product);
  }

  return products;
};
