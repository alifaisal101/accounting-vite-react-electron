import deleteBtn from './../../../assets/Delete-button.svg';

import Btn from '../../ui/btn/Btn';
import Loader from '../../ui/loader/Loader';
import './CustomersForm.css';

import { Fragment, useEffect, useState } from 'react';

function CustomerForm() {
  const [customersNames, setCustomersNames] = useState([]);
  const [matchingCustomersNames, setMatchingCustomersNames] = useState([]);
  const [nameIsFocused, setNameIsFocused] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [triedToAdd, setTriedToAdd] = useState(false);

  // Product
  const [productTitleIsFocused, setProductTitleIsFocused] = useState(false);
  const [productsSuggestions, setProductsSuggestions] = useState([]);
  const [matchingProductsSuggestions, setMatchingProductsSuggestions] =
    useState([]);
  const product_inital = {
    _id: '',
    imageUrl: '',
    title: '',
    price: 0,
    key: '',
  };
  const [product, setProduct] = useState(product_inital);
  const [triedToAddProduct, setTriedToAddProduct] = useState(false);
  const [productsList, setProductsList] = useState([]);

  // Get customers names, get products
  useEffect(() => {
    setLoading(true);
    e_customers.getCustomersNames((err, result) => {
      if (err) {
        return alert('فشل سحب اسماء الزبائن');
      }

      if (result) {
        setCustomersNames(result.customersNames);
      }

      e_products.fetchProducts((err, result) => {
        if (err) {
          return alert('فشل سحب السلع');
        }

        if (result) {
          setProductsSuggestions(result);
        }

        setLoading(false);
      });
    });
  }, []);

  //// PRODUCTS START  ////

  const productsListComponent = [];
  if (productsList) {
    for (let i = 0; i < productsList.length; i++) {
      const product = productsList[i];
      productsListComponent.push(
        <li className="table-row" key={product.key}>
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
          <div className="col col-4 delete-btn">
            <img
              src={deleteBtn}
              alt="Delete"
              onClick={() => {
                deleteProduct(product._id);
              }}
            />
          </div>
        </li>
      );
    }
  }

  // Function to add a new product
  const addProduct = () => {
    setTriedToAddProduct(true);
    if (!product.title || !product.price) {
      return alert('يجب وضع سعر واسم للسعلة');
    }

    product.key = product._id ? product._id : Math.random();
    setProductsList((_productsList) => {
      if (!_productsList?.length) {
        _productsList.push(product);
      } else {
        let doesProductExist = false;
        for (let i = 0; i < _productsList.length; i++) {
          if (product.key == _productsList[i].key) {
            doesProductExist = true;
          }
        }
        if (!doesProductExist) {
          _productsList.push(product);
        }
      }

      setTriedToAddProduct(false);
      setProduct(product_inital);
      return _productsList;
    });
  };

  // Use one of the matching products and fill the product state with it
  const useMatchingProduct = (product) => {
    setProduct(product);
    console.log(product);
  };

  // find matching products titles
  const findMatchingProductsTitles = (productTitle) => {
    const _matchingProductsSuggestions = [];

    setMatchingProductsSuggestions([]);
    for (let i = 0; i < productsSuggestions.length; i++) {
      const indexMatchedAt = productsSuggestions[i].title.search(
        new RegExp(productTitle, 'i')
      );
      if (indexMatchedAt != -1 && productTitle != '') {
        _matchingProductsSuggestions.push(productsSuggestions[i]);
      }
    }
    setMatchingProductsSuggestions(_matchingProductsSuggestions);
  };

  const ProductSuggestionsMatchingList_Component = [];
  if (matchingProductsSuggestions) {
    for (let i = 0; i < matchingProductsSuggestions.length; i++) {
      ProductSuggestionsMatchingList_Component.push(
        <li
          className="product_suggestion_item"
          onClick={() => {
            useMatchingProduct(matchingProductsSuggestions[i]);
          }}
          key={matchingProductsSuggestions[i]._id}
        >
          <div className="img-col" data-label="Image">
            {matchingProductsSuggestions[i].imageUrl ? (
              <img
                src={matchingProductsSuggestions[i].imageUrl}
                alt="Product Image"
              />
            ) : (
              <h4>لا صورة</h4>
            )}
          </div>
          {matchingProductsSuggestions[i].title}
        </li>
      );
    }
  }

  //// PRODUCTS END  ////

  //// CUSTOMER START ////

  // Function to go fetch a customer
  const fetchUseCustomer = (_id) => {
    setLoading(true);
    e_customers.fetchCustomer(_id, (err, result) => {
      if (err) {
        return alert('فشل سحب معلومات الزبون');
      }

      console.log(result);
      // setLoading(false);
      // console.log(result);
    });
  };

  // find matching customers names
  const findMatchingCustomersNames = (customerName) => {
    const _matchingCustomersNames = [];

    setMatchingCustomersNames([]);
    for (let i = 0; i < customersNames.length; i++) {
      const indexMatchedAt = customersNames[i].name.search(customerName);
      if (indexMatchedAt != -1 && customerName != '') {
        _matchingCustomersNames.push(customersNames[i]);
      }
    }

    setMatchingCustomersNames(_matchingCustomersNames);
  };

  const CustomersNamesSuggestionsComponents_itemlist = [];
  if (matchingCustomersNames) {
    for (let i = 0; i < matchingCustomersNames.length; i++) {
      CustomersNamesSuggestionsComponents_itemlist.push(
        <li
          className="names_suggestions_item"
          onClick={() => {
            fetchUseCustomer(matchingCustomersNames[i]._id);
          }}
          key={matchingCustomersNames[i]._id}
        >
          <div></div>
          {matchingCustomersNames[i].name}
        </li>
      );
    }
  }

  //// CUSTOMER END ////

  return (
    <div className="customer-form">
      <h1>اضافة زبون</h1>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h3 className="header">بيانات الزبون</h3>
          <div className="customersForm_inputs-container">
            <div className="customersForm_input-controller">
              <label htmlFor="name">اسم الزبون: </label>
              <input
                className={!customer.name && triedToAdd ? 'unvalid' : ''}
                type="text"
                id="name"
                name="name"
                value={customer.name}
                onFocus={() => {
                  setNameIsFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setNameIsFocused(false);
                  }, 200);
                }}
                onChange={(e) => {
                  findMatchingCustomersNames(e.target.value);
                  setCustomer((_customer) => {
                    return { ..._customer, name: e.target.value };
                  });
                }}
              />
              {matchingCustomersNames.length > 0 && nameIsFocused ? (
                <ul className="names_suggestions_list">
                  {CustomersNamesSuggestionsComponents_itemlist}
                </ul>
              ) : null}
            </div>
            <div className="customersForm_input-controller">
              <label htmlFor="name">رقم الهاتف:</label>
              <input
                className={!customer.phoneNumber && triedToAdd ? 'unvalid' : ''}
                type="text"
                id="name"
                name="name"
                value={customer.phoneNumber}
                onChange={(e) => {
                  setCustomer((_customer) => {
                    return { ..._customer, phoneNumber: e.target.value };
                  });
                }}
              />
            </div>
          </div>
          <h3 className="header">بيانات السلع</h3>
          <div className="customersForm_inputs-container">
            <div className="customersForm_input-controller">
              <label htmlFor="productTitle">اسم السلعة: </label>
              <input
                type="text"
                id="productTitle"
                name="productTitle"
                className={!product.title && triedToAddProduct ? 'unvalid' : ''}
                value={product.title}
                onFocus={() => {
                  setProductTitleIsFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setProductTitleIsFocused(false);
                  }, 200);
                }}
                onChange={(e) => {
                  findMatchingProductsTitles(e.target.value);
                  setProduct((_product) => {
                    return { ..._product, title: e.target.value };
                  });
                }}
              />
              {matchingProductsSuggestions.length > 0 &&
              productTitleIsFocused ? (
                <ul className="product_suggestion_list">
                  {ProductSuggestionsMatchingList_Component}
                </ul>
              ) : null}
            </div>
            <div className="customersForm_input-controller">
              <label htmlFor="productPrice">السعر: </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                className={!product.price && triedToAddProduct ? 'unvalid' : ''}
                value={product.price}
                onChange={(e) => {
                  setProduct((_product) => {
                    return { ..._product, price: e.target.value };
                  });
                }}
              />
            </div>
          </div>
          <Btn onClick={addProduct} className="customersform_add-product-btn">
            اضافة السلعة
          </Btn>
          <div className="products-table">
            <ul className="responsive-table">
              <li className="table-header">
                <div className="col col-1">الصورة</div>
                <div className="col col-2">السلعة</div>
                <div className="col col-3">السعر</div>
                <div className="col col-4">الحذف</div>
              </li>
              <div className="products-list">{productsListComponent}</div>
            </ul>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default CustomerForm;
