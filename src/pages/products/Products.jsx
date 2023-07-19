import { useEffect } from 'react';
import Btn from '../../components/ui/btn/Btn';
import './Products.css';

function Products(props) {
  useEffect(() => {
    e_products.fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <Btn className="add-product-btn" onClick={props.action}>
        اضافة سلعة
      </Btn>
    </div>
  );
}

export default Products;
