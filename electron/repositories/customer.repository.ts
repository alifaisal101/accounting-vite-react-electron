import { FilterQuery, PipelineStage } from 'mongoose';
import CustomerModel, {
  InCustomer,
  InCustomerWithPurchases,
} from '../models/customer';

interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
}

type getCustomersWithPurchasesType = Promise<
  PaginatedResult<InCustomerWithPurchases>
>;

export async function getCustomersWithPurchases(
  filter: PipelineStage,
  sortModel: PipelineStage[],
  take?: number,
  skip?: number
): getCustomersWithPurchasesType {
  const result = await CustomerModel.aggregate([
    { $match: {} }, // Match all documents (you can add conditions here for filtering)
    lookupPurchases(),
    ...unwindPurchasesAndPayments(),
    groupByCustomerCalculateEarliestPaymentDatePushPurchasesPayments(),
    projectCalculateEarliestPaymentAndUnfulfilledPayment(),
    calculateEarliestPaymentDateAndPushPurchasesAndPayments(),
    filter,
    ...sortModel,
    countTotalCountAndApplyPagination(take, skip),
    getTotalCountAndData(),
    convertIdToStringAndReshapeData(),
  ]);

  if (result[0]?.data?.length > 0) {
    return result[0];
  }

  return {
    data: [],
    totalCount: 0,
  };
}
function lookupPurchases() {
  return {
    $lookup: {
      from: 'purchases',
      localField: 'purchasesIds',
      foreignField: '_id',
      as: 'purchases',
    },
  };
}
function unwindPurchasesAndPayments() {
  return [
    {
      $unwind: { path: '$purchases', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: {
        path: '$purchases.payments',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}
function groupByCustomerCalculateEarliestPaymentDatePushPurchasesPayments() {
  return {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      phoneNumber: { $first: '$phoneNumber' },
      createdAt: { $first: '$createdAt' },
      notes: { $first: '$notes' },
      purchases: { $push: '$purchases' },
      payments: { $push: '$purchases.payments' },
    },
  };
}
function projectCalculateEarliestPaymentAndUnfulfilledPayment() {
  return {
    $project: {
      name: 1,
      phoneNumber: 1,
      createdAt: 1,
      notes: 1,
      purchases: 1,
      payments: 1,
      earliestPaymentDate: {
        $let: {
          vars: {
            filteredPayments: {
              $filter: {
                input: '$payments',
                as: 'payment',
                cond: { $ne: ['$$payment.status', 'full'] },
              },
            },
          },
          in: { $min: '$$filteredPayments.date' },
        },
      },
    },
  };
}

function calculateEarliestPaymentDateAndPushPurchasesAndPayments() {
  return {
    $project: {
      name: 1,
      phoneNumber: 1,
      createdAt: 1,
      notes: 1,
      purchases: 1,
      earliestPaymentDate: 1,
      unFulfilledPayment: {
        $cond: {
          if: { $lt: ['$earliestPaymentDate', new Date()] }, // If earliest payment date is before today
          then: true,
          else: false,
        },
      },
    },
  };
}

function countTotalCountAndApplyPagination(take: number, skip: number) {
  return {
    $facet: {
      metadata: [{ $count: 'totalCount' }],
      data: [
        { $skip: skip }, // Skip results based on pagination
        { $limit: take }, // Limit the number of results based on pagination
      ],
    },
  };
}
function getTotalCountAndData() {
  return {
    $project: {
      data: 1,
      totalCount: { $arrayElemAt: ['$metadata.totalCount', 0] },
    },
  };
}
function convertIdToStringAndReshapeData() {
  return {
    $project: {
      data: {
        $map: {
          input: '$data',
          as: 'customer',
          in: {
            _id: { $toString: '$$customer._id' },
            name: '$$customer.name',
            phoneNumber: '$$customer.phoneNumber',
            createdAt: '$$customer.createdAt',
            notes: '$$customer.notes',
            unFulfilledPayment: '$$customer.unFulfilledPayment',
            earliestPaymentDate: '$$customer.earliestPaymentDate',
          },
        },
      },
      totalCount: 1,
    },
  };
}
