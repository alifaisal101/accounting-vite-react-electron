import './Products.css';

import { useEffect, useState } from 'react';
import Btn from '../../components/ui/btn/Btn';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../../components/ui/loader/Loader';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

function Products(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    e_products.fetchProducts((err, result) => {
      setLoading(false);
      if (err) {
        return alert('فشل سحب السلع');
      }

      setProducts(result);
    });
  }, []);

  return (
    <div className="products-page" dir="rtl">
      <Btn className="add-product-btn" onClick={props.action}>
        اضافة سلعة
      </Btn>
      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <DataGrid
          className="products-table"
          rows={[]}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      ) : (
        <h1>لم تسجل اي سلع بعد</h1>
      )}
    </div>
  );
}

export default Products;
