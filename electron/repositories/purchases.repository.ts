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

        totalSells: {
          $sum: {
            $let: {
              vars: {
                amount: '$payments.amount',
              },
              in: {
                $cond: [
                  // Check if amount is a string of 5 digits or more and ends with "000"
                  {
                    $and: [
                      { $gt: [{ $strLenBytes: { $toString: '$$amount' } }, 4] }, // More than 4 digits
                      { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                    ],
                  },
                  // If it ends with 000 and has more than 4 digits, divide by 1000
                  { $divide: ['$payments.amount', 1000] },
                  // Otherwise, use the amount as is
                  '$payments.amount',
                ],
              },
            },
          },
        },
        totalDebt: {
          $sum: {
            $let: {
              vars: {
                amount: '$payments.amount',
                paidUp: '$payments.paidUp',
              },
              in: {
                $subtract: [
                  // Check if the amount ends with "000" and has more than 4 digits
                  {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      // If the condition is met, divide the amount by 1000
                      { $divide: ['$payments.amount', 1000] },
                      // Otherwise, use the amount as is
                      '$payments.amount',
                    ],
                  },
                  // Check if the paidUp amount ends with "000" and has more than 4 digits
                  {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      // If the condition is met, divide the paidUp by 1000
                      { $divide: ['$payments.paidUp', 1000] },
                      // Otherwise, use the paidUp amount as is
                      '$payments.paidUp',
                    ],
                  },
                ],
              },
            },
          },
        },
        totalPaidUp: {
          $sum: {
            $let: {
              vars: {
                paidUp: '$payments.paidUp',
              },
              in: {
                $cond: [
                  // Check if the paidUp amount has more than 4 digits and ends with "000"
                  {
                    $and: [
                      { $gt: [{ $strLenBytes: { $toString: '$$paidUp' } }, 4] }, // More than 4 digits
                      { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                    ],
                  },
                  // If the condition is met, divide the paidUp by 1000
                  { $divide: ['$payments.paidUp', 1000] },
                  // Otherwise, use the paidUp amount as is
                  '$payments.paidUp',
                ],
              },
            },
          },
        },
        currentYearSells: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      // If the condition is met, divide by 1000
                      { $divide: ['$payments.amount', 1000] },
                      // Otherwise, use the amount as is
                      '$payments.amount',
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
        lastYearSells: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.amount', 1000] },
                      '$payments.amount',
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
        currentYearDebt: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
        lastYearDebt: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
        currentYearPaidUp: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, currentYear] },
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
        lastYearPaidUp: {
          $sum: {
            $cond: [
              { $eq: [{ $year: '$payments.date' }, lastYear] },
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.amount', 1000] },
                      '$payments.amount',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.amount', 1000] },
                      '$payments.amount',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.amount', 1000] },
                      '$payments.amount',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$amount' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.amount', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.amount', 1000] },
                      '$payments.amount',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    amount: '$payments.amount',
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $subtract: [
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$amount' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.amount', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.amount', 1000] },
                          '$payments.amount',
                        ],
                      },
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $gt: [
                                  { $strLenBytes: { $toString: '$$paidUp' } },
                                  4,
                                ],
                              }, // More than 4 digits
                              {
                                $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0],
                              }, // Ends with 000
                            ],
                          },
                          { $divide: ['$payments.paidUp', 1000] },
                          '$payments.paidUp',
                        ],
                      },
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
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
              {
                $let: {
                  vars: {
                    paidUp: '$payments.paidUp',
                  },
                  in: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gt: [
                              { $strLenBytes: { $toString: '$$paidUp' } },
                              4,
                            ],
                          }, // More than 4 digits
                          { $eq: [{ $mod: ['$payments.paidUp', 1000] }, 0] }, // Ends with 000
                        ],
                      },
                      { $divide: ['$payments.paidUp', 1000] },
                      '$payments.paidUp',
                    ],
                  },
                },
              },
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
