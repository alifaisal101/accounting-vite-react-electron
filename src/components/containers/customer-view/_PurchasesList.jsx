import './_PurchasesList.css';

import { mappayPeriodType } from './../../../../electron/utils/locale';
import { mapPaymentPayStatus } from './../../../../electron/utils/locale';

import { useState } from 'react';

function _PurchasesList(props) {
  const [purchases, setPurchases] = useState(props.purchases);
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
            {_payment.paidUp}
          </div>
        );

        PaymentsStatusComponents.push(
          <div
            className="customer-view_purchases-list_row_cell_payment-item"
            key={_payment._id}
          >
            {mapPaymentPayStatus(_payment.status)}
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
