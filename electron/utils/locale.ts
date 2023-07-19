export const mappayPeriodType = (
  payPeriodType: 'weekly' | 'monthly' | 'yearly'
): string => {
  const payPeriodTypes = {
    weekly: 'أسبوعيا',
    monthly: 'شهريا',
    yearly: 'سنويا',
  };

  return payPeriodTypes[payPeriodType];
};
