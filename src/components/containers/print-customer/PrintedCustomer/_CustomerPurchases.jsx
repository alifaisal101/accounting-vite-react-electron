import { mappayPeriodType } from './../../../../../electron/utils/locale';
import { mapPaymentPayStatus } from './../../../../../electron/utils/locale';

function _CustomerPurchases(props) {
  const CustomerPurchasesComponents = [];

  if (props?.purchases?.length > 0) {
    for (let i = 0; i < props.purchases.length; i++) {
      const _purchase = props.purchases[i];

      const ProductItemsComponents = [];
      const ProductPricesComponents = [];
      for (let y = 0; y < _purchase.purchasedProducts.length; y++) {
        const _purchasdProduct = _purchase.purchasedProducts[y];
        ProductItemsComponents.push(
          <div className="printed-customer_purchases_list_cell_product-item">
            {_purchasdProduct.title}
          </div>
        );

        ProductPricesComponents.push(
          <div className="printed-customer_purchases_list_cell_product-item">
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
          <div className="printed-customer_purchases_list_cell_payment-amount-item">
            {_payment.amount}
          </div>
        );

        PaymentsPayDateComponents.push(
          <div className="printed-customer_purchases_list_cell_payment-date-item">
            {_payment.date}
          </div>
        );

        PaymentsPaidUpComponents.push(
          <div className="printed-customer_purchases_list_cell_payment-paidup-item">
            {_payment.paidUp}
          </div>
        );

        PaymentsStatusComponents.push(
          <div className="printed-customer_purchases_list_cell_payment-status-item">
            {mapPaymentPayStatus(_payment.status)}
          </div>
        );
      }

      CustomerPurchasesComponents.push(
        <div className="printed-customer_purchases_list_row">
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
            {_purchase.totalCost}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-4">
            {_purchase.debt}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-5">
            {_purchase.purchaseDate}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-6">
            {_purchase.upFrontPaymentAmount}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-7">
            {_purchase.periodicalPaymentAmount}
          </div>
          <div className="printed-customer_purchases_list_cell printed-customer_purchases_list_cell_col-8">
            {mappayPeriodType(_purchase.payPeriodType)}
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
        <div className="printed-customer_purchases_list_row">
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
