import ProductModel, { InProduct } from '../models/product';

export const createProduct = async (product_body: InProduct) => {
  const product_data = {
    ...product_body,
    createdAt: new Date(),
  };

  if (!product_data.image) {
    delete product_data.image;
  }

  try {
    const product = new ProductModel(product_data);
    return await product.save();
  } catch (err) {}
};
