export const mappedPeriodType = (
  payPeriodType: 'weekly' | 'monthly' | 'yearly'
): string => {
  const payPeriodTypes = {
    weekly: 'أسبوعيا',
    monthly: 'شهريا',
    yearly: 'سنويا',
  };

  return payPeriodTypes[payPeriodType];
};

export const mapPaymentPayStatus = (
  paymentStatus: 'unpaid' | 'partial' | 'full'
) => {
  const paymentStatusTypes = {
    unpaid: 'غير مدفوع',
    partial: 'مدفوع جزئيا',
    full: 'مدفوع كاملا',
  };

  return paymentStatusTypes[paymentStatus];
};

export const mapMoneyAmount = (amount: number) => {
  // Add 3 zeros to the number
  const newNumber = amount * 1000;

  // Convert the number to a string with commas
  return newNumber.toLocaleString();
};
