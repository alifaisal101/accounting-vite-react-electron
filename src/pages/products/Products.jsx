import './Products.css';

import { useEffect, useState } from 'react';
import Btn from '../../components/ui/btn/Btn';
import Loader from '../../components/ui/loader/Loader';
import reactimg from './../../assets/react.jpg';

function Products(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("I'm running");
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
    console.log(product);
    productsComponents.push(
      <li className="table-row">
        <div className="col col-1 img-col" data-label="Image">
          <img src={reactimg} alt="" srcset="" />
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
        <div className="col col-8" data-label="Up Front Payment Amount">
          Pending
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
          <h2>
            Responsive Tables Using LI <small>Triggers on 767px</small>
          </h2>
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
