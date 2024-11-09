import { calculateFinancesSummary } from '../repositories/purchases.repository';

export const getFinancesSummery = async () => {
  return await calculateFinancesSummary();
};
