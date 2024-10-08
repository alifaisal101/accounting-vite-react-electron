import { useEffect, useState, Fragment } from 'react';
import PrintCustomer from '../print-customer/PrintCustomer';
import Loader from './../../../components/ui/loader/Loader';
import './CustomerView.css';
import _PurchasesList from './_PurchasesList';
import Btn from '../../ui/btn/Btn';

function CustomerView(props) {
  const [customer, setCustomer] = useState({});
  const [printSettings, setPrintSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const savePurchases = () => {
    e_customers.savePurchases(customer.purchases, (err, result) => {
      if (err) {
        return alert('فشل حفظ البيانات');
      }

      if (result) {
        e_customers.addCustomer({ ...customer }, (err, result) => {
          if (err) {
            return alert('فشل حفظ البيانات');
          }

          return props.unmountAndMountDropdown();
        });
      }
    });
  };

  const deleteCustomer = (_id) => {
    if (!confirm('هل انت متأكد انك تريد حذف بيانات الزبون ؟')) {
      return 0;
    }

    setLoading(true);
    e_customers.deleteCustomer(_id, (err, result) => {
      setLoading(false);

      if (err) {
        return alert('فشل حذف الزبون');
      }

      if (result) {
        setCustomer({});
        alert('تم حذف الزبون');
        props.unmountContentContainer();
        return props.unmountDropdown();
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    e_customers.fetchCustomer(true, props._id, (err, result) => {
      if (err) {
        return alert('فشل سحب الزبون');
      }

      if (result) {
        if (result?.purchases) {
          let totalPurchasesCosts = 0;
          let totalDebt = 0;
          for (let i = 0; i < result.purchases.length; i++) {
            const _purchase = result.purchases[i];
            totalPurchasesCosts += _purchase.totalCost;
            totalDebt += _purchase.debt;
          }

          result.totalDebt = totalDebt;
          result.totalPurchasesCosts = totalPurchasesCosts;
        }
        setCustomer(result);
        return e_print.getPrintSettings(
          (printsettingserr, printsettingsresult) => {
            if (printsettingserr) {
              return alert('فشل سحب معلومات الطباعة');
            }

            if (result) {
              setPrintSettings(printsettingsresult);
              return setLoading(false);
            }
          }
        );
      }
    });
  }, []);
  return (
    <div className="customer-view">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="customer-view_customer-info">
            <div className="customer-view_customer-info_item customer-view_customer-info_name">
              الأسم: {customer.name}
            </div>
            <div className="customer-view_customer-info_item customer-view_customer-info_phoneNumber">
              رقم الهاتف: {customer.phoneNumber}
            </div>
            <div className="customer-view_customer-info_item customer-view_customer-info_totalcosts">
              مجموع المشتريات: {customer.totalPurchasesCosts}
            </div>
            <div className="customer-view_customer-info_item customer-view_customer-info_totaldebts">
              مجموع الديون: {customer.totalDebt}
            </div>
          </div>

          {
            <_PurchasesList
              setPurchases={(_purchases) => {
                setCustomer((_customer) => {
                  return { ..._customer, purchases: _purchases };
                });
              }}
              purchases={customer.purchases}
            />
          }

          <h3>الملاحظات</h3>

          <div className="customer-view_notes-container">
            <textarea
              name="notes"
              id="notes"
              rows="10"
              onChange={(e) => {
                setCustomer((_customer) => {
                  return { ..._customer, notes: e.target.value };
                });
              }}
              className="customer-view_notes-container_notes"
              value={customer.notes}
            ></textarea>
          </div>
          <div className="customer-view_action-btns_container">
            <PrintCustomer customer={customer} printSettings={printSettings} />
            <Btn
              className="customer-view_action-btns_container_save-data"
              onClick={() => {
                savePurchases();
              }}
            >
              حفظ التعديلات
            </Btn>
            <Btn
              className="customer-view_action-btns_container_delete-customer-btn"
              onClick={() => deleteCustomer(customer._id)}
            >
              ×
            </Btn>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default CustomerView;
