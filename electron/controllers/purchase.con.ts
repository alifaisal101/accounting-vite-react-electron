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
