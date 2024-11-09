import './Customers.css';
import React, { useEffect, useState, Fragment } from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
    width: 150,
    type: 'string',
    editable: false,
  },
  {
    field: 'createdAt',
    headerName: 'تاريخ الاضافة',
    type: 'date',
    width: 130,
  },
  {
    field: 'earliestPaymentDate',
    headerName: 'موعد الدفع',
    type: 'date',
    width: 100,
    cellClassName: (rowObj) => {
      const currentDate = moment(moment().format('YYYY-MM-DD'));
      const earliestPaymentDate = moment(
        moment(rowObj.row.earliestPaymentDate).format('YYYY-MM-DD')
      );
      if (earliestPaymentDate.isBefore(currentDate)) {
        return 'late-pay-date';
      } else if (earliestPaymentDate.isSame(currentDate)) {
        return 'today-pay-date';
      }
    },
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
  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [searchModel, setSearchModel] = useState();
  const [sortModel, setSortModel] = useState([
    {
      field: 'createdAt',
      sort: 'desc',
    },
  ]);
  const [loading, setLoading] = useState(false);
  // Handle filter model change
  const handleFilterModelChange = (newFilterModel) => {
    const updatedItems = newFilterModel.items.map((filter) => {
      // Check if the field is a date and the operator is 'is'
      if (
        (filter.field === 'createdAt' ||
          filter.field === 'earliestPaymentDate') &&
        filter.operator === 'is'
      ) {
        return {
          ...filter,
          operator: 'at', // Change 'is' to 'at' for date fields
        };
      }
      return filter;
    });

    setSearchModel({
      ...newFilterModel,
      items: updatedItems,
    });
  };
  useEffect(() => {
    setLoading(true);
    let take = paginationModel.pageSize;
    let skip = paginationModel.page * paginationModel.pageSize;
    e_customers.fetchCustomers(
      take,
      skip,
      searchModel,
      sortModel,
      (err, result) => {
        if (err) {
          return alert('فشل سحب الزبائن');
        }
        setLoading(false);
        if (result) {
          result.data = result.data.map((customer) => {
            {
              return { ...customer, id: customer._id };
            }
          });
          setCount(result.totalCount);
          return setCustomers(result.data);
        }
      }
    );
  }, [paginationModel, searchModel, sortModel]);

  return (
    <div className="customers-list" dir="rtl">
      <h1>قائمة الزبائن</h1>

      <Fragment>
        <div className="data-grid-container">
          <DataGrid
            onRowClick={(data) => {
              props.action(data.id);
            }}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            rows={customers}
            rowCount={count}
            columns={columns}
            loading={loading}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            pageSize={paginationModel.pageSize}
            onPaginationModelChange={setPaginationModel}
            page={paginationModel.page}
            onSortModelChange={setSortModel}
            onFilterModelChange={handleFilterModelChange}
          />
        </div>
      </Fragment>
    </div>
  );
}

export default Customers;
