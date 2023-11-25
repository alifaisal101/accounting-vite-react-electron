import moment from 'moment';

import CustomerModel from '../models/customer';
import PurchaseModel from '../models/purchase';
import { addPurchases, fetchPurchases } from './purchase.con';
import mongoose from 'mongoose';

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
  const { _id, name, phoneNumber, purchases, notes } = customer;
  const customerPurchasesIds = [];

  const purchases_data = [];
  for (let i = 0; i < purchases.length; i++) {
    const purchase = purchases[i];
    if (purchase._id == '') {
      delete purchase._id;
    } else if (purchase._id) {
      customerPurchasesIds.push(purchase._id);
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
        purchasesIds: customerPurchasesIds.concat(purchasesIds),
        notes,
      },
      { new: true }
    );
  } else {
    result = await CustomerModel.create({
      name,
      phoneNumber,
      purchasesIds,
      createdAt: new Date(),
      notes,
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
  const result = await CustomerModel.aggregate([
    { $match: {} },
    {
      $lookup: {
        from: 'purchases',
        localField: 'purchasesIds',
        foreignField: '_id',
        as: 'purchases',
      },
    },
    { $project: { purchasesIds: 0 } },
  ]);

  // Filtering: converting the objId -> string; deleting purchases; adding unFulfilled Payment
  const _customers = [];
  for (let i = 0; i < result.length; i++) {
    const _customer = result[i];

    // unFulfilled Payments | earliest payment date processing
    let unFulfilledPayment = false;
    let earliestPaymentDate = 0;

    for (let y = 0; y < _customer.purchases.length; y++) {
      const purchase = _customer.purchases[y];
      for (let x = 0; x < purchase.payments.length; x++) {
        const payment = purchase.payments[x];
        const unpaid =
          payment.status == 'partial' || payment.status == 'unpaid';
        // Check if the payment is unpaid or paid partially, and if the payment date is today or behind
        if (
          unpaid &&
          moment(payment.date).isBefore(moment(moment().format('YYYY-MM-DD')))
        ) {
          unFulfilledPayment = true;
        }
        // Adding the earliest payment date
        if (!earliestPaymentDate && unpaid) {
          earliestPaymentDate = payment.date;
        } else if (
          moment(earliestPaymentDate).isAfter(moment(payment.date)) &&
          unpaid
        ) {
          earliestPaymentDate = payment.date;
        }
      }
    }

    _customer._id = _customer._id.toString();
    _customer.unFulfilledPayment = unFulfilledPayment;
    _customer.earliestPaymentDate = earliestPaymentDate;
    delete _customer.purchases;

    _customers.push(_customer);
  }

  return _customers;
};

export const fetchCustomersOnDate = async (date: any) => {
  const dateObject_before = new Date(
    moment(date).subtract(1, 'd').toISOString()
  );
  const dateObject_after = new Date(moment(date).add(1, 'd').toISOString());

  const purchasesIds = [];
  const purchases = await PurchaseModel.find({
    'payments.date': { $gte: dateObject_before, $lt: dateObject_after },
  });
  for (let i = 0; i < purchases.length; i++) {
    purchasesIds.push(purchases[i]._id);
  }

  if (purchases.length == 0) {
    return [];
  }

  const customers = await CustomerModel.find({
    purchasesIds: { $in: purchasesIds },
  });

  const _customers = [];

  for (let i = 0; i < customers.length; i++) {
    //@ts-ignore
    const _customer = customers[i]._doc;
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

export const deleteCustomer = async (_id: string) => {
  return await CustomerModel.deleteOne({ _id });
};
