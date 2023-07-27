import './_PurchasesList.css';

import { mappayPeriodType } from './../../../../electron/utils/locale';
import { mapPaymentPayStatus } from './../../../../electron/utils/locale';

import { useState } from 'react';
import moment from 'moment/moment';

function _PurchasesList(props) {
  const [purchases, setPurchases] = useState(props.purchases);

  const calculateDebt = (payments) => {
    let debt = 0;
    for (let i = 0; i < payments.length; i++) {
      const _payment = payments[i];
      debt += _payment.amount - _payment.paidUp;
    }
    return debt;
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
        purchases[i].debt = calculateDebt(_purchase.payments);
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
              _purchases[i].payments[y].paidUp = newPaidUpValue;

              if (newPaidUpValue == 0) {
                _purchases[i].payments[y].paidUp = 0;
                _purchases[i].payments[y].status = 'unpaid';
              } else if (newPaidUpValue < _payment.amount) {
                _purchases[i].payments[y].status = 'partial';
              } else if (newPaidUpValue >= _payment.amount) {
                _purchases[i].payments[y].paidUp = _payment.amount;
                _purchases[i].payments[y].status = 'full';
              }
            }
          }
        }
        purchases[i].debt = calculateDebt(_purchase.payments);
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
            {_purchasdProduct.title}
          </div>
        );

        ProductPricesComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_product-price-item"
            key={_purchasdProduct._id}
          >
            {_purchasdProduct.price}
          </div>
        );
      }

      const PaymentsAmountsComponents = [];
      const PaymentsPayDateComponents = [];
      const PaymentsPaidUpComponents = [];
      const PaymentsStatusComponents = [];

      for (let y = 0; y < _purchase.payments.length; y++) {
        const _payment = _purchase.payments[y];

        PaymentsAmountsComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            {_payment.amount}
          </div>
        );

        PaymentsPayDateComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            {_payment.date}
          </div>
        );

        PaymentsPaidUpComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            <input
              type="text"
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
      }

      PurchasesRowsComponents.push(
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
            {_purchase.totalCost}
          </div>
          <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-4">
            {_purchase.debt}
          </div>
          <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-5">
            {_purchase.purchaseDate}
          </div>
          <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-6">
            {_purchase.upFrontPaymentAmount}
          </div>
          <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-7">
            {_purchase.periodicalPaymentAmount}
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
        </div>
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
      </div>
      {PurchasesRowsComponents}
    </div>
  );
}

export default _PurchasesList;
