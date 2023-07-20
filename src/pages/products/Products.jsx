import './Products.css';
import deleteBtn from './../../assets/Delete-button.svg';

import { useEffect, useState } from 'react';
import Btn from '../../components/ui/btn/Btn';
import Loader from '../../components/ui/loader/Loader';
import moment from 'moment/moment';

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

  const productsComponents = [];
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    productsComponents.push(
      <li className="table-row" key={product._id}>
        <div className="col col-1 img-col" data-label="Image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="Product Image" />
          ) : (
            <h4>لا صورة</h4>
          )}
        </div>
        <div className="col col-2" data-label="Product Title">
          {product.title}
        </div>
        <div className="col col-3" data-label="Price">
          {product.price}
        </div>
        <div className="col col-4" data-label="Desc">
          {product.desc ? product.desc : 'بدون ملاحظات'}
        </div>
        <div className="col col-5" data-label="Pay Period Type">
          {product.payPeriodType}
        </div>
        <div className="col col-6" data-label="Periodical Payment">
          Pending
        </div>
        <div className="col col-7" data-label="Up Front Payment Amount">
          Pending
        </div>
        <div className="col col-8" data-label="Created At">
          {moment(product.createdAt).format('YYYY/MM/DD')}
        </div>
        <div className="col col-9 delete-btn">
          <img src={deleteBtn} alt="Delete" />
        </div>
      </li>
    );
  }

  return (
    <div className="products-page" dir="rtl">
      <Btn className="add-product-btn" onClick={props.action}>
        اضافة سلعة
      </Btn>
      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <div className="products-table">
          <ul className="responsive-table">
            <li className="table-header">
              <div className="col col-1">الصورة</div>
              <div className="col col-2">السلعة</div>
              <div className="col col-3">السعر</div>
              <div className="col col-4">الملاحظات</div>
              <div className="col col-5">نوع القسط</div>
              <div className="col col-6">القسط</div>
              <div className="col col-7">المقدم</div>
              <div className="col col-8">تاريخ الاضافة</div>
              <div className="col col-9">الحذف</div>
            </li>
            <div className="products-list">{productsComponents}</div>
          </ul>
        </div>
      ) : (
        <h1>لم تسجل اي سلع بعد</h1>
      )}
    </div>
  );
}

export default Products;
