import CustomerModel from '../models/customer';
import PurchaseModel from '../models/purchase';

export const getCustomersNames = async () => {
  const customersNames = await CustomerModel.find({}, { _id: 1, name: 1 });

  const result = {
    customersNames: [],
  };

  if (customersNames) {
    for (let i = 0; i < customersNames.length; i++) {
      const customerName = {
        //@ts-ignore
        ...customersNames[i]._doc,
        _id: customersNames[i]._id.toString(),
      };
      //@ts-ignore
      result.customersNames.push(customerName);
    }
  }

  return result;
};

export const fetchCustomer = async (_id: string) => {
  const customer = CustomerModel.findById(_id).populate(
    'purchasesIds',
    {},
    PurchaseModel
  );

  //@ts-ignore
  const customerData = customer._doc || {};

  return customerData;
};
