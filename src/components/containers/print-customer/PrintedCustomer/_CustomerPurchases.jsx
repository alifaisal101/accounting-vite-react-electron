import {
  mapMoneyAmount,
  mappedPeriodType,
} from './../../../../../electron/utils/functions/locale';
import { mapPaymentPayStatus } from './../../../../../electron/utils/functions/locale';

function _CustomerPurchases(props) {
  const CustomerPurchasesComponents = [];

  if (props?.purchases?.length > 0) {
    for (let i = 0; i < props.purchases.length; i++) {
      const _purchase = props.purchases[i];

      const ProductItemsComponents = [];
      const ProductPricesComponents = [];
      for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
        const _purchasedProduct = _purchase.purchasedProducts[y];
        ProductItemsComponents.push(
          <div
            className="printed-customer_purchases_list_cell_product-item"
            key={_purchasedProduct._id}
          >
            {_purchasedProduct.title}
          </div>
        );

        ProductPricesComponents.push(
          <div
            className="printed-customer_purchases_list_cell_product-item"
            key={_purchasedProduct._id}
          >
            {mapMoneyAmount(_purchasedProduct.price)}
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
            className="printed-customer_purchases_list_cell_payment-amount-item"
            key={_payment._id}
          >
            {mapMoneyAmount(_payment.amount)}
          </div>
        );

        PaymentsPayDateComponents.push(
          <div
            className="printed-customer_purchases_list_cell_payment-date-item"
            key={_payment._id}
          >
            {_payment.date}
          </div>
        );

        PaymentsPaidUpComponents.push(
          <div
            className="printed-customer_purchases_list_cell_payment-paidup-item"
            key={_payment._id}
          >
            {mapMoneyAmount(_payment.paidUp)}
          </div>
        );

        PaymentsStatusComponents.push(
          <div
            className="printed-customer_purchases_list_cell_payment-status-item"
            key={_payment._id}
          >
            {mapPaymentPayStatus(_payment.status)}
          </div>
        );
      }

      CustomerPurchasesComponents.push(
        <div
          className="printed-customer_purchases_list_row"
          key={_purchase._id}
        >
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-1">
            <div className="printed-customer_purchases_list_cell_product-list">
              {ProductItemsComponents}
            </div>
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-2">
            <div className="printed-customer_purchases_list_cell_product-price-list">
              {ProductPricesComponents}
            </div>
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-3">
            {mapMoneyAmount(_purchase.totalCost)}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-4">
            {mapMoneyAmount(_purchase.debt)}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-5">
            {_purchase.purchaseDate}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-6">
            {mapMoneyAmount(_purchase.upFrontPaymentAmount)}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-7">
            {mapMoneyAmount(_purchase.periodicalPaymentAmount)}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-8">
            {mappedPeriodType(_purchase.payPeriodType)}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-9">
            <div className="printed-customer_purchases_list_cell_payment-amount-list">
              {PaymentsAmountsComponents}
            </div>
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-10">
            <div className="printed-customer_purchases_list_cell_payment-date-list">
              {PaymentsPayDateComponents}
            </div>
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-11">
            <div className="printed-customer_purchases_list_cell_payment-paidup-list">
              {PaymentsPaidUpComponents}
            </div>
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-12">
            <div className="printed-customer_purchases_list_cell_payment-status-list">
              {PaymentsStatusComponents}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="printed-customer_purchases">
      <div className="printed-customer_purchases_list">
        <div className="printed-customer_purchases_list_row" key={1}>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-1">
            السلع
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-2">
            الاسعار
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-3">
            السعر الكامل
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-4">
            الدين
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-5">
            تاريخ الشراء
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-6">
            المقدم
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-7">
            القسط
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-8">
            نوع القسط
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-9">
            الدفوعات (مقدار)
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-10">
            الموعد
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-11">
            تم دفع (مقدار)
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-12">
            الحالة
          </div>
        </div>
        {CustomerPurchasesComponents}
      </div>
    </div>
  );
}

export default _CustomerPurchases;
