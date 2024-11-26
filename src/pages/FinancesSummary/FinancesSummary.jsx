import { useEffect, useState } from 'react';
import './FinancesSummary.css';
import { DataGrid } from '@mui/x-data-grid';
const columns = [
  {
    headerName: 'النوع',
    field: 'type',
    width: 300,
    editable: false,
    sortable: false,
    filterable: false,
  },
  {
    headerName: 'المقدار',
    field: 'amount',
    width: 300,
    sortable: false,
    editable: false,
    filterable: false,
    valueGetter: (params) => {
      let amount = params.row.amount;

      // Check if amount is a string and contains commas
      if (typeof amount === 'string') {
        // Remove commas and convert to a number
        amount = parseFloat(amount.replace(/,/g, ''));
      }

      // Multiply the amount by 1000 if it's a valid number
      if (!isNaN(amount)) {
        // Multiply by 1000 and format with commas
        return (amount * 1000).toLocaleString();
      } else {
        return '0'; // Default to 0 if it's not a valid number
      }
    },
  },
  {
    headerName: 'الزمن',
    field: 'timePeriod',
    width: 300,
    editable: false,
    sortable: false,
    filterable: false,
  },
];

function mapFinancesSummaryData(financesSummaryData) {
  const financesSummaryDataMapObject = {
    totalSells: {
      localizedName: 'إجمالي المبيعات',
      localizedDuration: 'الإجمالي لجميع الفترات',
    },
    totalDebt: {
      localizedName: 'إجمالي الديون',
      localizedDuration: 'الإجمالي لجميع الفترات',
    },
    totalPaidUp: {
      localizedName: 'إجمالي المدفوعات',
      localizedDuration: 'الإجمالي لجميع الفترات',
    },
    currentYearSells: {
      localizedName: 'مبيعات السنة الحالية',
      localizedDuration: 'السنة الحالية',
    },
    lastYearSells: {
      localizedName: 'مبيعات السنة الماضية',
      localizedDuration: 'السنة الماضية',
    },
    currentYearDebt: {
      localizedName: 'ديون السنة الحالية',
      localizedDuration: 'السنة الحالية',
    },
    lastYearDebt: {
      localizedName: 'ديون السنة الماضية',
      localizedDuration: 'السنة الماضية',
    },
    currentYearPaidUp: {
      localizedName: 'مدفوعات السنة الحالية',
      localizedDuration: 'السنة الحالية',
    },
    lastYearPaidUp: {
      localizedName: 'مدفوعات السنة الماضية',
      localizedDuration: 'السنة الماضية',
    },
    currentMonthSells: {
      localizedName: 'مبيعات الشهر الحالي',
      localizedDuration: 'الشهر الحالي',
    },
    lastMonthSells: {
      localizedName: 'مبيعات الشهر الماضي',
      localizedDuration: 'الشهر الماضي',
    },
    currentMonthDebt: {
      localizedName: 'ديون الشهر الحالي',
      localizedDuration: 'الشهر الحالي',
    },
    lastMonthDebt: {
      localizedName: 'ديون الشهر الماضي',
      localizedDuration: 'الشهر الماضي',
    },
    currentMonthPaidUp: {
      localizedName: 'مدفوعات الشهر الحالي',
      localizedDuration: 'الشهر الحالي',
    },
    lastMonthPaidUp: {
      localizedName: 'مدفوعات الشهر الماضي',
      localizedDuration: 'الشهر الماضي',
    },
    currentDaySells: {
      localizedName: 'مبيعات اليوم الحالي',
      localizedDuration: 'اليوم الحالي',
    },
    lastDaySells: {
      localizedName: 'مبيعات اليوم السابق',
      localizedDuration: 'اليوم السابق',
    },
    currentDayDebt: {
      localizedName: 'ديون اليوم الحالي',
      localizedDuration: 'اليوم الحالي',
    },
    lastDayDebt: {
      localizedName: 'ديون اليوم السابق',
      localizedDuration: 'اليوم السابق',
    },
    currentDayPaidUp: {
      localizedName: 'مدفوعات اليوم الحالي',
      localizedDuration: 'اليوم الحالي',
    },
    lastDayPaidUp: {
      localizedName: 'مدفوعات اليوم السابق',
      localizedDuration: 'اليوم السابق',
    },
  };
  const rows = [];
  const objectKeys = Object.keys(financesSummaryData);
  for (let i = 0; i < objectKeys.length; i++) {
    const row = {
      type: '',
      amount: '',
      timePeriod: '',
      id: i,
    };
    const key = objectKeys[i];
    const value = financesSummaryData[key];
    row.type = financesSummaryDataMapObject[key].localizedName;
    row.amount = value.toLocaleString('en-US');
    row.timePeriod = financesSummaryDataMapObject[key].localizedDuration;
    rows.push(row);
  }
  return rows;
}

const FinancesSummary = () => {
  const [loading, setLoading] = useState(false);
  const [financesSummaryRows, setFinancesSummaryRows] = useState([]);
  useEffect(() => {
    setLoading(true);
    e_financesSummary.getFinancesSummary((err, result) => {
      if (err) {
        return alert('فشل سحب بيانات الملخص المالي');
      }
      setFinancesSummaryRows(mapFinancesSummaryData(result[0]));
      setLoading(false);
    });
  }, []);
  return (
    <div className="financesSummary-page" dir="rtl">
      <h1 className="financesSummary-page_header">الملخص المالي</h1>
      <DataGrid
        className="financesSummary-page_datagrid"
        rows={financesSummaryRows}
        columns={columns}
        pageSizeOptions={[]}
        loading={loading}
      ></DataGrid>
    </div>
  );
};

export default FinancesSummary;
