import './Customers.css';
import React, { useEffect, useState, Fragment } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { DataGrid } from '@mui/x-data-grid';
import Loader from './../../components/ui/loader/Loader';

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

function Customers(props) {
  const [dateValue, setDate] = useState(new Date());
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    e_customers.fetchCustomers({}, (err, result) => {
      if (err) {
        return alert('فشل سحب الزبائن');
      }

      setLoading(false);
      if (result) {
        result = result.map((customer) => {
          {
            return { ...customer, id: customer._id };
          }
        });
        return setCustomers(result);
      }
    });
  }, []);

  return (
    <div className="customers-list" dir="rtl">
      <h1>قائمة الزبائن</h1>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <DatePicker onChange={setDate} value={dateValue} locale="ar-AR" />
          {customers.length == 0 ? (
            <h1>لم يتم العثور على اي زبائن</h1>
          ) : (
            <div className="data-grid-container">
              <DataGrid
                onRowClick={(data) => {
                  props.action(data.id);
                }}
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
              />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default Customers;
