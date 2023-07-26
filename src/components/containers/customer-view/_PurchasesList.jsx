import './_PurchasesList.css';

function _PurchasesList() {
  return (
    <div className="customer-view_purchases-list">
      <div className="customer-view_purchases-list_row customer-view_purchases-list_row-header">
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
      <div className="customer-view_purchases-list_row">
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-1">
          <div className="customer-view_purchases-list_row_cell_products-list">
            <div className="customer-view_purchases-list_row_cell_product-item">
              epic
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              IPoone 231 sa عربي 9023 نكبل
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              مدري شنو 6
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              باور ف ج
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              هذات و شسهت 0ه{' '}
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              djas j9j
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-2">
          <div className="customer-view_purchases-list_row_cell_products-prices-list">
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              800000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              400000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              500000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              150000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              75000
            </div>
          </div>
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
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-10">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-11">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              <input value={1200000} />
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              <input value={1200000} />
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              <input value={1200000} />
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              <input value={1200000} />
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              <input value={1200000} />
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-12">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع جزئيا
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
          </div>
        </div>
      </div>
      <div className="customer-view_purchases-list_row">
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-1">
          <div className="customer-view_purchases-list_row_cell_products-list">
            <div className="customer-view_purchases-list_row_cell_product-item">
              epic
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              IPoone 231 sa عربي 9023 نكبل
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              مدري شنو 6
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              باور ف ج
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              هذات و شسهت 0ه{' '}
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              djas j9j
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-2">
          <div className="customer-view_purchases-list_row_cell_products-prices-list">
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              800000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              400000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              500000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              150000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              75000
            </div>
          </div>
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
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-10">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-11">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-12">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع جزئيا
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
          </div>
        </div>
      </div>
      <div className="customer-view_purchases-list_row">
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-1">
          <div className="customer-view_purchases-list_row_cell_products-list">
            <div className="customer-view_purchases-list_row_cell_product-item">
              epic
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              IPoone 231 sa عربي 9023 نكبل
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              {' '}
              مدري شنو 6
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              باور ف ج
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              هذات و شسهت 0ه{' '}
            </div>
            <div className="customer-view_purchases-list_row_cell_product-item">
              djas j9j
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-2">
          <div className="customer-view_purchases-list_row_cell_products-prices-list">
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              800000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              400000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              500000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              150000
            </div>
            <div className="customer-view_purchases-list_row_cell_product-price-item">
              75000
            </div>
          </div>
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
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1200000
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-10">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              2023/12/23
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-11">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              1000000
            </div>
          </div>
        </div>
        <div className="customer-view_purchases-list_row_cell customer-view_purchases-list_row_cell_col-12">
          <div className="customer-view_purchases-list_row_cell_payments-list">
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              مدفوع جزئيا
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
            <div className="customer-view_purchases-list_row_cell_payment-item">
              غير مدفوع
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default _PurchasesList;
