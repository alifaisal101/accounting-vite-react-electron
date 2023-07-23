import moment from 'moment';

import CustomerModel from '../models/customer';
import PurchaseModel from '../models/purchase';
import { addPurchases } from './purchase.con';

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

export const saveCustomer = async (customer: any) => {
  const { _id, name, phoneNumber, purchases } = customer;

  const purchases_data = [];
  for (let i = 0; i < purchases.length; i++) {
    const purchase = purchases[i];
    if (purchase._id == '') {
      delete purchase._id;
    } else if (purchase._id) {
      continue;
    }
    if (purchase.key) {
      delete purchase.key;
    }

    purchase.purchaseDate = new Date(
      moment(purchase.purchaseDate).toISOString()
    );
    purchase.payStartDate = new Date(
      moment(purchase.payStartDate).toISOString()
    );
    purchase.debt = purchase.totalCost - purchase.upFrontPaymentAmount;

    const paymentsQuantity_decimal =
      purchase.debt / purchase.periodicalPaymentAmount;
    const paymentsQuantity = Math.ceil(paymentsQuantity_decimal);
    const leftOutPayment = paymentsQuantity_decimal % 1;
    const payments = [];
    for (let pay_number = 0; pay_number < paymentsQuantity; pay_number++) {
      let amount = 0;
      if (pay_number + 1 == paymentsQuantity && leftOutPayment > 0) {
        amount = leftOutPayment * purchase.periodicalPaymentAmount;
      } else {
        amount = purchase.periodicalPaymentAmount;
      }
      payments.push({
        paidUp: 0,
        status: 'unpaid',
        date: new Date(
          moment(purchase.payStartDate)
            .add(pay_number, purchase.payPeriodType.split('')[0].toUpperCase())
            .toISOString()
        ),
        amount: Math.round(amount),
      });
    }

    // @ts-ignore
    purchase.payments = payments;
    purchases_data.push(purchase);
  }

  //@ts-ignore
  const { purchases_docs, purchasesIds } = await addPurchases(purchases_data);

  let result;

  if (_id) {
    result = await CustomerModel.findByIdAndUpdate(
      _id,
      {
        name,
        phoneNumber,
        purchasesIds,
      },
      { new: true }
    );
  } else {
    result = await CustomerModel.create({
      name,
      phoneNumber,
      purchasesIds,
      createdAt: new Date(),
    });
  }

  // @ts-ignore
  result = result._doc;
  result._id = result._id.toString();

  console.log(result);
};
