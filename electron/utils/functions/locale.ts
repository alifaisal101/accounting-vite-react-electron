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
