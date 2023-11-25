import './Customers.css';
import React, { useEffect, useState, Fragment } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Loader from './../../components/ui/loader/Loader';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import reloadIcon from './../../assets/reload.svg';
import moment from 'moment';

const columns = [
  {
    field: 'name',
    headerName: 'الأسم',
    width: 300,
    type: 'text',
    editable: false,
  },
  {
    field: 'phoneNumber',
    headerName: 'رقم الهاتف',
    width: 180,
    type: 'string',
    editable: false,
  },
  {
    field: 'createdAt',
    headerName: 'تاريخ الاضافة',
    type: 'date',
    width: 150,
  },
  {
    field: 'unFulfilledPayment',
    headerName: 'متأخر عن الدفع',
    type: 'boolean',
    width: 150,
    cellClassName: (rowObj) => {
      return rowObj.row.unFulfilledPayment
        ? 'late-for-payment-cellitem '
        : 'notlate-payment-cellitem';
    },
  },
];

function Customers(props) {
  const [dateValue, setDate] = useState(moment());
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dateHandler = (date) => {
    const momentDayObj = moment(date._d);
    setDate(momentDayObj);
    setLoading(true);
    e_customers.fetchOnDates(momentDayObj.toISOString(), (err, result) => {
      if (err) {
        return alert('فشل سحب الزبائن');
      }

      if (result) {
        setLoading(false);
        result = result.map((customer) => {
          {
            return { ...customer, id: customer._id };
          }
        });
        setLoading(false);
        return setCustomers(result);
      }
    });
  };

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
          <div className="date-reload-container">
            <div className="reload-icon-container">
              <img
                src={reloadIcon}
                alt="Reload"
                onClick={() => {
                  props.unmountContentContainer();
                }}
              />
            </div>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker value={dateValue} onChange={dateHandler} />
            </LocalizationProvider>{' '}
          </div>
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
                      pageSize: 6,
                    },
                  },
                }}
                pageSizeOptions={[6]}
              />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default Customers;
