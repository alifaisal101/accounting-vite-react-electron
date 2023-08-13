import './_PurchasesList.css';

import { mappayPeriodType } from './../../../../electron/utils/locale';
import { mapPaymentPayStatus } from './../../../../electron/utils/locale';

import deleteBtn from './../../../assets/Delete-button.svg';

import { Fragment, useState } from 'react';
import moment from 'moment/moment';
import Btn from '../../ui/btn/Btn';

function _PurchasesList(props) {
  const [purchases, setPurchases] = useState(props.purchases);

  const calculateDebt = (_purchase) => {
    let debt = _purchase.totalCost - _purchase.upFrontPaymentAmount;
    for (let i = 0; i < _purchase.payments.length; i++) {
      const _payment = _purchase.payments[i];
      debt -= _payment.paidUp;
    }
    return debt;
  };

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
      const _product = products[i];
      totalPrice += +_product.price;
    }
    return totalPrice;
  };

  // Payments Modifing //

  const addNewPaymentHandler = (purchaseId) => {
    e_util.genNewMongoIdStr((err, idResult) => {
      if (err) {
        return alert('فشلت الاضافة');
      }
      setPurchases((_purchases) => {
        for (let i = 0; i < purchases.length; i++) {
          const _purchase = purchases[i];

          if (_purchase._id == purchaseId) {
            const lastPayment =
              _purchase.payments?.length > 0
                ? _purchase.payments[_purchase.payments.length - 1]
                : null;
            _purchase.payments.push({
              _id: idResult,
              amount: lastPayment ? lastPayment.amount : 0,
              date: lastPayment
                ? moment(lastPayment.date).add(1, 'M').format('yyyy-MM-DD')
                : moment().add(1, 'M').format('yyyy-MM-DD'),
              paidUp: 0,
              status: 'unpaid',
            });
          }
        }
        return [..._purchases];
      });
      props.setPurchases(purchases);
    });
  };

  const paymentDeleteHandler = (purchaseId, paymentId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.payments.length; y++) {
            const _payment = _purchase.payments[y];
            if (_payment._id == paymentId) {
              purchases[i].payments.splice(y, 1);
              purchases[i].debt = calculateDebt(purchases[i]);
            }
          }
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const paymentStatusHandler = (newPaymentStatus, purchaseId, paymentId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.payments.length; y++) {
            const _payment = _purchase.payments[y];
            if (_payment._id == paymentId) {
              _purchases[i].payments[y].status = newPaymentStatus;

              if (newPaymentStatus == 'full') {
                _purchases[i].payments[y].paidUp = _payment.amount;
              }

              if (newPaymentStatus == 'unpaid') {
                _purchases[i].payments[y].paidUp = 0;
              }
            }
          }
        }
        purchases[i].debt = calculateDebt(_purchase);
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const paidUpHandler = (newPaidUpValue, purchaseId, paymentId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.payments.length; y++) {
            const _payment = _purchase.payments[y];
            if (_payment._id == paymentId) {
              _purchases[i].payments[y].paidUp =
                10000000000 > +newPaidUpValue && +newPaidUpValue >= 0
                  ? +newPaidUpValue
                  : +_purchases[i].payments[y].paidUp;

              if (_purchases[i].payments[y].paidUp == 0) {
                _purchases[i].payments[y].paidUp = 0;
                _purchases[i].payments[y].status = 'unpaid';
              } else if (_purchases[i].payments[y].paidUp < _payment.amount) {
                _purchases[i].payments[y].status = 'partial';
              } else if (_purchases[i].payments[y].paidUp >= _payment.amount) {
                _purchases[i].payments[y].paidUp = _payment.amount;
                _purchases[i].payments[y].status = 'full';
              }
            }
          }
        }
        purchases[i].debt = calculateDebt(purchases[i]);
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const paymentAmountHandler = (newPaymentAmount, purchaseId, paymentId) => {
    let _paidUp;
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.payments.length; y++) {
            const _payment = _purchase.payments[y];
            if (_payment._id == paymentId) {
              _purchases[i].payments[y].amount =
                10000000000 > +newPaymentAmount && +newPaymentAmount >= 0
                  ? +newPaymentAmount
                  : _purchases[i].payments[y].amount;

              _paidUp = _purchases[i].payments[y].paidUp;
            }
          }
        }
        purchases[i].debt = calculateDebt(_purchase);
      }
      return [..._purchases];
    });
    paidUpHandler(_paidUp, purchaseId, paymentId);
    props.setPurchases(purchases);
  };

  const paymentDateHandler = (newPaymentDate, purchaseId, paymentId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.payments.length; y++) {
            const _payment = _purchase.payments[y];
            if (_payment._id == paymentId) {
              console.log(
                moment(newPaymentDate).isBefore(moment(_purchase.purchaseDate))
              );
              if (
                moment(newPaymentDate).isBefore(moment(_purchase.purchaseDate))
              ) {
                alert('لا يمكن تسجيل تاريخ الدفع قبل تاريخ الشراء');
              } else {
                _purchases[i].payments[y].date = newPaymentDate;
              }
            }
          }
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  // Products Modifing //

  const productNameHandler = (newProductName, purchaseId, productId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
            const _product = _purchase.purchasedProducts[y];
            if (_product._id == productId) {
              _product.title = newProductName;
            }
          }
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const productPriceHandler = (newProductPrice, purchaseId, productId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
            const _product = _purchase.purchasedProducts[y];
            if (_product._id == productId) {
              _product.price =
                10000000000 > +newProductPrice && +newProductPrice >= 0
                  ? +newProductPrice
                  : _product.price;

              _purchase.totalCost = calculateTotalPrice(
                _purchase.purchasedProducts
              );
            }
          }
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  // Purchase Modifing //

  const totalCostHandler = (newTotalCost, purchaseId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          _purchases[i].totalCost =
            10000000000 > +newTotalCost && +newTotalCost >= 0
              ? +newTotalCost
              : _purchases[i].totalCost;

          _purchase.debt = calculateDebt(_purchase);
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const debtHandler = (newDebt, purchaseId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          _purchases[i].debt =
            10000000000 > +newDebt && +newDebt >= 0
              ? +newDebt
              : _purchases[i].debt;
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const purchaseDateHandler = (newPurchaseDate, purchaseId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          if (moment(newPurchaseDate)) {
            _purchases[i].purchaseDate = newPurchaseDate;
          } else {
            _purchases[i].purchaseDate = newPurchaseDate;
          }
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const upFrontPaymentHandler = (newUpfrontPayment, purchaseId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          _purchases[i].upFrontPaymentAmount =
            10000000000 > +newUpfrontPayment && +newUpfrontPayment >= 0
              ? +newUpfrontPayment
              : _purchases[i].upFrontPaymentAmount;

          _purchase.debt = calculateDebt(_purchase);
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const periodicalPaymentAmountHandler = (newPeriodicalPayment, purchaseId) => {
    setPurchases((_purchases) => {
      for (let i = 0; i < purchases.length; i++) {
        const _purchase = purchases[i];

        if (_purchase._id == purchaseId) {
          _purchases[i].periodicalPaymentAmount =
            10000000000 > +newPeriodicalPayment && +newPeriodicalPayment >= 0
              ? +newPeriodicalPayment
              : _purchases[i].periodicalPaymentAmount;
        }
      }
      return [..._purchases];
    });
    props.setPurchases(purchases);
  };

  const PurchasesRowsComponents = [];

  if (purchases?.length > 0) {
    for (let i = 0; i < purchases.length; i++) {
      const _purchase = purchases[i];

      const ProductItemsComponents = [];
      const ProductPricesComponents = [];
      for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
        const _purchasdProduct = _purchase.purchasedProducts[y];
        ProductItemsComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_product-item"
            key={_purchasdProduct._id}
          >
            <input
              type="text"
              name={_purchasdProduct._id + '_title'}
              id={_purchasdProduct._id + '_title'}
              value={_purchasdProduct.title}
              className="no-border"
              onChange={(e) => {
                productNameHandler(
                  e.target.value,
                  _purchase._id,
                  _purchasdProduct._id
                );
              }}
            />
          </div>
        );

        ProductPricesComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_product-price-item"
            key={_purchasdProduct._id}
          >
            <input
              type="number"
              step={5000}
              name={_purchasdProduct._id + '_productprice'}
              id={_purchasdProduct._id + '_productprice'}
              value={_purchasdProduct.price}
              onChange={(e) => {
                productPriceHandler(
                  e.target.value,
                  _purchase._id,
                  _purchasdProduct._id
                );
              }}
            />
          </div>
        );
      }

      const PaymentsAmountsComponents = [];
      const PaymentsPayDateComponents = [];
      const PaymentsPaidUpComponents = [];
      const PaymentsStatusComponents = [];
      const PaymentsDeleteComponents = [];

      for (let y = 0; y < _purchase.payments.length; y++) {
        const _payment = _purchase.payments[y];

        PaymentsAmountsComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            <input
              type="number"
              step={5000}
              name={_payment._id + '_amount'}
              id={_payment._id + '_amount'}
              value={_payment.amount}
              onChange={(e) => {
                paymentAmountHandler(
                  e.target.value,
                  _purchase._id,
                  _payment._id
                );
              }}
            />
          </div>
        );

        PaymentsPayDateComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            <input
              type="date"
              name={_payment._id + '_date'}
              id={_payment._id + '_date'}
              value={_payment.date}
              onChange={(e) => {
                paymentDateHandler(e.target.value, _purchase._id, _payment._id);
              }}
            />
          </div>
        );

        PaymentsPaidUpComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            <input
              type="number"
              step={5000}
              value={_payment.paidUp}
              onChange={(e) => {
                paidUpHandler(e.target.value, _purchase._id, _payment._id);
              }}
            />
          </div>
        );

        let paymentStatusClass = '';
        switch (_payment.status) {
          case 'unpaid':
            if (moment(_payment.date).isSameOrBefore(new Date())) {
              paymentStatusClass = 'payment-status_unpaid';
            }
            break;
          case 'partial':
            paymentStatusClass = 'payment-status_partial';
            break;
          case 'full':
            paymentStatusClass = 'payment-status_full';
            break;
        }

        PaymentsStatusComponents.push(
          <div
            className={
              'customer-view_purchases-list_row_cell_payment-item customer-view_purchases-list_row_cell_payment-item_paymentStatus ' +
              paymentStatusClass
            }
            key={_payment._id}
          >
            <select
              name="payment_status"
              id={`payment_status_${_payment._id}`}
              value={_payment.status}
              onChange={(e) => {
                paymentStatusHandler(
                  e.target.value,
                  _purchase._id,
                  _payment._id
                );
              }}
            >
              <option value="unpaid">غير مدفوع</option>
              <option value="partial">مدفوع جزئيا</option>
              <option value="full">مدفوع كاملا</option>
            </select>
          </div>
        );

        PaymentsDeleteComponents.push(
          <div
            className={
              'customer-view_purchases-list_row_cell_payment-item customer-view_purchases-list_row_cell_payment-item_paymentDelete'
            }
            key={_payment._id}
          >
            <img
              src={deleteBtn}
              onClick={() => {
                paymentDeleteHandler(_purchase._id, _payment._id);
              }}
              alt="X"
            />{' '}
          </div>
        );
      }

      PurchasesRowsComponents.push(
        <Fragment key={_purchase._id}>
          <div className="customer-view_purchases-list_row" key={_purchase._id}>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-1">
              <div className="customer-view_purchases-list_row_cell_products-list">
                {ProductItemsComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-2">
              <div className="customer-view_purchases-list_row_cell_products-prices-list">
                {ProductPricesComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-3">
              <input
                type="number"
                name={_purchase._id + '_totalCost'}
                id={_purchase._id + '_totalCost'}
                step={5000}
                value={_purchase.totalCost}
                onChange={(e) => {
                  totalCostHandler(e.target.value, _purchase._id);
                }}
              />
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-4">
              <input
                type="number"
                name={_purchase._id + '_debt'}
                id={_purchase._id + '_debt'}
                step={5000}
                value={_purchase.debt}
                onChange={(e) => {
                  debtHandler(e.target.value, _purchase._id);
                }}
              />
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-5">
              <input
                type="date"
                name={_purchase._id + '_date'}
                id={_purchase._id + '_date'}
                value={_purchase.purchaseDate}
                onChange={(e) => {
                  purchaseDateHandler(e.target.value, _purchase._id);
                }}
              />
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-6">
              <input
                type="number"
                name={_purchase._id + '_upfrontPay'}
                id={_purchase._id + '_upfrontPay'}
                step={5000}
                value={_purchase.upFrontPaymentAmount}
                onChange={(e) => {
                  upFrontPaymentHandler(e.target.value, _purchase._id);
                }}
              />
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-7">
              <input
                type="number"
                name={_purchase._id + '_periodicalPaymentAmount'}
                id={_purchase._id + '_periodicalPaymentAmount'}
                step={5000}
                value={_purchase.periodicalPaymentAmount}
                onChange={(e) => {
                  periodicalPaymentAmountHandler(e.target.value, _purchase._id);
                }}
              />
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-8">
              {mappayPeriodType(_purchase.payPeriodType)}
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-9">
              <div className="customer-view_purchases-list_row_cell_payments-list">
                {PaymentsAmountsComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-10">
              <div className="customer-view_purchases-list_row_cell_payments-list">
                {PaymentsPayDateComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-11">
              <div className="customer-view_purchases-list_row_cell_payments-list">
                {PaymentsPaidUpComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-12">
              <div className="customer-view_purchases-list_row_cell_payments-list">
                {PaymentsStatusComponents}
              </div>
            </div>
            <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-13">
              <div className="customer-view_purchases-list_row_cell_payments-list">
                {PaymentsDeleteComponents}
              </div>
            </div>
          </div>
          <div className="add-new-payment-btn_container">
            <Btn
              onClick={() => {
                addNewPaymentHandler(_purchase._id);
              }}
              className="add-new-payment-btn"
            >
              +
            </Btn>
          </div>
        </Fragment>
      );
    }
  }

  return (
    <div className="customer-view_purchases-list">
      <div
        key={21}
        className="customer-view_purchases-list_row customer-view_purchases-list_row-header"
      >
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-1">
          السلع
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-2">
          الاسعار
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-3">
          السعر الكامل
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-4">
          الدين
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-5">
          تاريخ الشراء
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-6">
          المقدم
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-7">
          القسط
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-8">
          نوع القسط
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-9">
          الدفوعات (مقدار)
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-10">
          الموعد
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-11">
          تم دفع (مقدار)
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-12">
          الحالة
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-13">
          حذف
        </div>
      </div>
      {PurchasesRowsComponents}
    </div>
  );
}

export default _PurchasesList;
