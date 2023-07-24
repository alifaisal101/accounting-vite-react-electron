import { ObjectId, ProjectionType } from 'mongoose';
import PurchaseModel, { InPurchase } from '../models/purchase';

export const addPurchases = async (purchases: InPurchase[]) => {
  const result = await PurchaseModel.insertMany(purchases);
  const purchasesIds = [];
  const purchases_docs = [];

  for (let i = 0; i < result.length; i++) {
    // @ts-ignore
    const _purchase = result[i]._doc;
    _purchase._id = _purchase._id.toString();

    purchasesIds.push(_purchase._id);
    purchases_docs.push(_purchase);
  }

  return { purchases: purchases_docs, purchasesIds };
};

export const fetchPurchases = async (
  purchasesIds: ObjectId[],
  projection: ProjectionType<InPurchase> | null | undefined
) => {
  const result = await PurchaseModel.find({ _id: purchasesIds }, projection);
  const _purchases = [];
  for (let i = 0; i < result.length; i++) {
    //@ts-ignore
    const _purchase = result[i]._doc;
    _purchase._id = _purchase._id.toString();

    // Purchased Products
    const _purchasedProducts = [];
    for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
      const _purchasedProduct = _purchase.purchasedProducts[y]._doc;
      //@ts-ignore
      _purchasedProduct._id = _purchasedProduct._id.toString();
      _purchasedProduct.productId = _purchasedProduct._id.toString();
      _purchasedProducts.push(_purchasedProduct);
    }

    _purchase.purchasedProducts = _purchasedProducts;

    // Payments
    if (_purchase?.payments?.length > 0) {
      const _payments = [];
      for (let y = 0; y < _purchase.payments.length; y++) {
        const _payment = _purchase.payments[i]._doc;
        //@ts-ignore
        _payment._id = _payment._id.toString();
        _payments.push(_payment);
      }
      _purchase.payments = _payments;
    }

    _purchases.push(_purchase);
  }

  return _purchases;
};
