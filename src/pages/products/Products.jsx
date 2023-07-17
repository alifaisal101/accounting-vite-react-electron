import Btn from '../../components/ui/btn/Btn';
import './Products.css';

function Products(props) {
  return (
    <div className="products-page">
      <Btn className="add-product-btn" onClick={props.action}>
        اضافة سلعة
      </Btn>
    </div>
  );
}

export default Products;
