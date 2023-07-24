import './Customers.css';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'name',
    headerName: 'الأسم',
    width: 300,
    editable: false,
  },
  {
    field: 'phoneNumber',
    headerName: 'رقم الهاتف',
    width: 180,
    editable: true,
  },
  {
    field: 'createdAt',
    headerName: 'تاريخ الاضافة',
    type: 'date',
    width: 110,
  },
];

function Customers() {
  const [dateValue, setDate] = useState(new Date());
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    e_customers.fetchCustomers({}, (err, result) => {
      if (err) {
        return alert('فشل سحب الزبائن');
      }
      if (result) {
        console.log(result);
        // setCustomers(result);
      }
    });
  }, []);

  return (
    <div className="" dir="rtl">
      {/* <DatePicker onChange={setDate} value={dateValue} locale="ar-AR" />
      <DataGrid
        rows={customers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      /> */}
    </div>
  );
}

export default Customers;
