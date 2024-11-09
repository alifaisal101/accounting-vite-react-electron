import moment from 'moment';
import PurchaseModel from '../models/purchase';

export async function calculateFinancesSummary() {
  const currentYear = moment().year();
  const lastYear = currentYear - 1;
  const currentMonth = moment().month() + 1; // MongoDB months are 0-indexed
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const currentDay = moment().date();
  const lastDay =
    currentDay === 1 ? moment().subtract(1, 'day').date() : currentDay - 1;

  const result = await PurchaseModel.aggregate([
    // Unwind payments to work with each payment separately
    { $unwind: '$payments' },

    // Match payments with the necessary conditions
    {
      $match: {
        'payments.date': { $exists: true },
      },
    },

    // Group by various time periods and calculate sums
    {
      $group: {
        _id: null, // Aggregate across all purchases

        totalSells: { $sum: '$payments.amount' },
        totalDebt: { $sum: '$debt' },
        totalPaidUp: { $sum: '$payments.paidUp' },

        currentYearSells: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              '$payments.amount',
              0,
            ],
          },
        },
        lastYearSells: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              '$payments.amount',
              0,
            ],
          },
        },

        currentYearDebt: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              '$debt',
              0,
            ],
          },
        },
        lastYearDebt: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              '$debt',
              0,
            ],
          },
        },

        currentYearPaidUp: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              '$payments.paidUp',
              0,
            ],
          },
        },
        lastYearPaidUp: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              '$payments.paidUp',
              0,
            ],
          },
        },

        currentMonthSells: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, currentMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.amount',
              0,
            ],
          },
        },
        lastMonthSells: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, lastMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.amount',
              0,
            ],
          },
        },

        currentMonthDebt: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, currentMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$debt',
              0,
            ],
          },
        },
        lastMonthDebt: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, lastMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$debt',
              0,
            ],
          },
        },

        currentMonthPaidUp: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, currentMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.paidUp',
              0,
            ],
          },
        },
        lastMonthPaidUp: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$payments.date' }, lastMonth] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.paidUp',
              0,
            ],
          },
        },

        currentDaySells: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, currentDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.amount',
              0,
            ],
          },
        },
        lastDaySells: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, lastDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.amount',
              0,
            ],
          },
        },

        currentDayDebt: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, currentDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$debt',
              0,
            ],
          },
        },
        lastDayDebt: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, lastDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$debt',
              0,
            ],
          },
        },

        currentDayPaidUp: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, currentDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.paidUp',
              0,
            ],
          },
        },
        lastDayPaidUp: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $dayOfMonth: '$payments.date' }, lastDay] },
                  { $eq: [{ $year: '$payments.date' }, currentYear] },
                ],
              },
              '$payments.paidUp',
              0,
            ],
          },
        },
      },
    },

    // Project final result with calculated fields
    {
      $project: {
        _id: 0,
        totalSells: 1,
        totalDebt: 1,
        totalPaidUp: 1,
        currentYearSells: 1,
        lastYearSells: 1,
        currentYearDebt: 1,
        lastYearDebt: 1,
        currentYearPaidUp: 1,
        lastYearPaidUp: 1,
        currentMonthSells: 1,
        lastMonthSells: 1,
        currentMonthDebt: 1,
        lastMonthDebt: 1,
        currentMonthPaidUp: 1,
        lastMonthPaidUp: 1,
        currentDaySells: 1,
        lastDaySells: 1,
        currentDayDebt: 1,
        lastDayDebt: 1,
        currentDayPaidUp: 1,
        lastDayPaidUp: 1,
      },
    },
  ]);

  return result;
}
