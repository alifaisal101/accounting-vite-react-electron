import moment from 'moment';

import CustomerModel from '../models/customer';
import PurchaseModel from '../models/purchase';
import { addPurchases, fetchPurchases } from './purchase.con';

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

export const fetchCustomer = async (_id: string, full: boolean) => {
  const customer = await CustomerModel.findById(_id);

  //@ts-ignore
  const customerData = customer._doc;
  customerData._id = customerData._id.toString();
  customerData.createdAt = moment(customerData.createdAt).format('yyyy-MM-DD');

  const proj = full ? {} : { payments: 0 };

  const purchases = await fetchPurchases(customerData.purchasesIds, proj);
  customerData.purchases = purchases;

  delete customerData.purchasesIds;

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
      moment(purchase.purchaseDate).add(1, 'd').toISOString()
    );
    purchase.payStartDate = new Date(
      moment(purchase.payStartDate).add(1, 'd').toISOString()
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

  const _purchasesIds = [];
  for (let i = 0; i < result.purchasesIds.length; i++) {
    _purchasesIds.push(result.purchasesIds[i].toString());
  }

  result.purchasesIds = _purchasesIds;
  return result;
};

export const fetchCustomers = async (dates?: { start: Date; end: Date }) => {
  const result = await CustomerModel.find();
  const _customers = [];

  for (let i = 0; i < result.length; i++) {
    //@ts-ignore
    const _customer = result[i]._doc;
    _customer._id = _customer._id.toString();

    const _purchasesIds = [];
    for (let i = 0; i < _customer.purchasesIds.length; i++) {
      _purchasesIds.push(_customer.purchasesIds[0].toString());
    }

    _customer.purchasesIds = _purchasesIds;
    _customers.push(_customer);
  }

  return _customers;
};
