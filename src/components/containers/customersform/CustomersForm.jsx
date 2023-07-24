import deleteBtn from './../../../assets/Delete-button.svg';

import Btn from '../../ui/btn/Btn';
import Loader from '../../ui/loader/Loader';
import './CustomersForm.css';

import { Fragment, useEffect, useState } from 'react';
import moment from 'moment/moment';

function CustomerForm() {
  const [customersNames, setCustomersNames] = useState([]);
  const [matchingCustomersNames, setMatchingCustomersNames] = useState([]);
  const [nameIsFocused, setNameIsFocused] = useState(false);
  const [customer, setCustomer] = useState({
    _id: '',
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

  // Purchases
  const [triedToAddPurchase, setTriedToAddPurchase] = useState(false);
  const purchase_inital = {
    purchasedProducts: [],
    totalCost: 0,
    upFrontPaymentAmount: 0,
    periodicalPaymentAmount: 0,
    purchaseDate: moment().format('yyyy-MM-DD'),
    payStartDate: moment().add(1, 'M').format('yyyy-MM-DD'),
    payPeriodType: 'monthly',
    key: Math.random(),
    _id: '',
  };
  const [purchase, setPurchase] = useState(purchase_inital);
  const [purchases, setPurchases] = useState([]);

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
        <li className="table-row" key={product.key ? product.key : product._id}>
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
      return alert('يجب وضع سعر واسم للسلعة');
    }

    setProduct((_product) => {
      return { ..._product, key: _product._id ? product.key : Math.random() };
    });

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
    setPurchase((_purchase) => {
      const _purchasedProducts = [];
      let _purchaseTotalCost = 0;
      for (let i = 0; i < productsList.length; i++) {
        _purchaseTotalCost += productsList[i].price;
        let _purchasedProduct = {
          productId: productsList[i]._id,
          title: productsList[i].title,
          price: productsList[i].price,
        };

        if (!_purchasedProduct.productId) {
          delete _purchasedProduct.productId;
        }

        _purchasedProducts.push(_purchasedProduct);
      }

      if (productsList.length == 1) {
        _purchase.upFrontPaymentAmount = productsList[0].upFrontPaymentAmount;
        _purchase.periodicalPaymentAmount =
          productsList[0].periodicalPaymentAmount;

        const payPeriodType_arr = productsList[0].payPeriodType;
        switch (payPeriodType_arr) {
          case 'أسبوعيا':
            _purchase.payPeriodType = 'weekly';
            break;
          case 'شهريا':
            _purchase.payPeriodType = 'monthly';
            break;
          case 'سنويا':
            _purchase.payPeriodType = 'yearly';
        }
      } else {
        _purchase.upFrontPaymentAmount = 0;
        _purchase.periodicalPaymentAmount = 0;
      }

      _purchase.totalCost = _purchaseTotalCost;
      _purchase.purchasedProducts = _purchasedProducts;
      return _purchase;
    });
  };

  // Use one of the matching products and fill the product state with it
  const useMatchingProduct = (product) => {
    setProduct(product);
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

  //// PURCHASE START ////

  const PurchasesList_component = [];
  if (purchases) {
    for (let i = 0; i < purchases.length; i++) {
      const _purchase = purchases[i];

      PurchasesList_component.push(
        <li
          className={`table-row  ${_purchase._id == '' ? '' : 'unmodifiable'}`}
          key={_purchase.key ? _purchase.key : _purchase._id}
        >
          <div className="col col-2" data-label="products">
            السلع
          </div>
          <div className="col col-3" data-label="Total cost">
            {_purchase.totalCost}
          </div>
          <div className="col col-4" data-label="Upfront Payment">
            {_purchase.upFrontPaymentAmount}
          </div>
          <div className="col col-5" data-label="Periodical Payment Amount">
            {_purchase.periodicalPaymentAmount}
          </div>
          <div className="col col-6" data-label="Purchase Date">
            {_purchase.purchaseDate}
          </div>
          <div className="col col-7" data-label="Payment Start Date">
            {_purchase.payStartDate}
          </div>
          <div className="col col-8" data-label="Pay type">
            {_purchase.payPeriodType}
          </div>
          <div className="col col-8 delete-btn">
            {_purchase._id == '' ? (
              <img
                src={deleteBtn}
                alt="Delete"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              />
            ) : null}
          </div>
        </li>
      );
    }
  }

  const addPurchase = () => {
    setTriedToAddPurchase(true);

    if (
      !purchase.totalCost ||
      !purchase.upFrontPaymentAmount ||
      !purchase.periodicalPaymentAmount ||
      purchase.periodicalPaymentAmount > purchase.totalCost ||
      purchase.upFrontPaymentAmount > purchase.totalCost
    ) {
      return alert('تأكد من ملئ المعلومات بشكل صحيح');
    }

    if (purchase.purchasedProducts.length == 0) {
      return alert('يجب على الأقل اضافة سلعة واحدة');
    }

    if (moment(purchase.purchaseDate).isAfter(moment(purchase.payStartDate))) {
      return alert('يجب ان يكون تاريخ بدء الدفع بعد تاريخ الشراء');
    }

    setPurchases((_purchases) => {
      if (!purchase?.length) {
        _purchases.push(purchase);
      } else {
        let doesPurchaseExist = false;
        for (let i = 0; i < purchases.length; i++) {
          if ((purchase.key == _purchases[i], key)) {
            doesPurchaseExist = true;
          }
        }

        if (!doesPurchaseExist) {
          _purchases.push(purchase);
        }
      }

      setTriedToAddPurchase(false);
      setProductsList([]);
      setPurchase(purchase_inital);
      return _purchases;
    });
  };

  //// PURCHASE END ////

  //// CUSTOMER START ////

  const addCustoemr = () => {
    e_customers.addCustomer({ ...customer, purchases }, (err, result) => {
      console.log(1);
      if (err) {
        return alert('فشل حفظ الزبون');
      }

      if (result) {
        console.log(result);
      }
    });
  };

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
                    return { ..._product, price: +e.target.value };
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
          <h3 className="header">بيانات المشتريات</h3>
          <div className="customersForm_inputs-container">
            <div className="customersForm_input-controller">
              <label htmlFor="totalcost">مجموع التكلفة: </label>
              <input
                className={
                  !purchase.totalCost && triedToAddPurchase ? 'unvalid' : ''
                }
                type="number"
                id="totalcost"
                name="totalcost"
                value={purchase.totalCost}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return { ..._purchase, totalCost: +e.target.value };
                  });
                }}
              />
            </div>

            <div className="customersForm_input-controller">
              <label htmlFor="upFrontPaymentAmount">المقدم :</label>
              <input
                className={
                  (!purchase.upFrontPaymentAmount ||
                    purchase.upFrontPaymentAmount > purchase.totalCost) &&
                  triedToAddPurchase
                    ? 'unvalid'
                    : ''
                }
                type="text"
                id="upFrontPaymentAmount"
                name="upFrontPaymentAmount"
                value={purchase.upFrontPaymentAmount}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return {
                      ..._purchase,
                      upFrontPaymentAmount: +e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="customersForm_input-controller">
              <label htmlFor="periodicalPaymentAmount">القسط :</label>
              <input
                className={
                  (!purchase.periodicalPaymentAmount ||
                    purchase.periodicalPaymentAmount > purchase.totalCost) &&
                  triedToAddPurchase
                    ? 'unvalid'
                    : ''
                }
                type="text"
                id="periodicalPaymentAmount"
                name="periodicalPaymentAmount"
                value={purchase.periodicalPaymentAmount}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return {
                      ..._purchase,
                      periodicalPaymentAmount: +e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="customersForm_inputs-container">
            <div className="customersForm_input-controller">
              <label htmlFor="totalcost">تاريخ الشراء: </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={purchase.purchaseDate}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return { ..._purchase, purchaseDate: e.target.value };
                  });
                }}
              />
            </div>
            <div className="customersForm_input-controller">
              <label htmlFor="payStartDate">تاريخ بدء الدفع: </label>
              <input
                type="date"
                id="payStartDate"
                name="payStartDate"
                value={purchase.payStartDate}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return { ..._purchase, payStartDate: e.target.value };
                  });
                }}
              />
            </div>
            <div className="customersForm_input-controller">
              <label htmlFor="payStartDate">نوع القسط: </label>
              <select
                name="payPeriodType"
                id="payPeriodType"
                value={purchase.payPeriodType}
                onChange={(e) => {
                  setPurchase((_purchase) => {
                    return { ..._purchase, payPeriodType: e.target.value };
                  });
                }}
              >
                <option value="weekly">أسبوعيا</option>
                <option value="monthly">شهريا</option>
                <option value="yearly">سنويا</option>
              </select>
            </div>
          </div>

          <Btn onClick={addPurchase} className="customersform_add-product-btn">
            اضافة الى المشتريات
          </Btn>
          <div className="products-table">
            <ul className="responsive-table">
              <li className="table-header">
                <div className="col col-2">السلع</div>
                <div className="col col-3">السعر الكامل</div>
                <div className="col col-4">المقدم</div>
                <div className="col col-5">القسط</div>
                <div className="col col-6">تاريخ الشراء</div>
                <div className="col col-7">تاريخ بدء الدفع</div>
                <div className="col col-8">نوع الدفع</div>
                <div className="col col-8">حذف</div>
              </li>
              <div className="products-list">{PurchasesList_component}</div>
            </ul>
          </div>
          <Btn onClick={addCustoemr} className="customersform_add-product-btn">
            اضافة الزبون
          </Btn>
        </Fragment>
      )}
    </div>
  );
}

export default CustomerForm;
