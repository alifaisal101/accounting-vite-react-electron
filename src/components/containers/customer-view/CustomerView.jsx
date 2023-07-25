import { useEffect, useState, Fragment } from 'react';
import PrintCustomer from '../print-customer/PrintCustomer';
import Loader from './../../../components/ui/loader/Loader';
import './CustomerView.css';

function CustomerView(props) {
  const [customer, setCustomer] = useState({});
  const [printSettings, setPrintSettings] = useState({});
  const [loading, setLoading] = useState(false);

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
        return e_print.getPrintSettings((err, result) => {
          if (err) {
            return alert('فشل سحب معلومات الطباعة');
          }

          if (result) {
            setPrintSettings(result);
            return setLoading(false);
          }
        });
      }
    });
  }, []);
  return (
    <div className="customer-view">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {props._id}

          <PrintCustomer customer={customer} printSettings={printSettings} />
        </Fragment>
      )}
    </div>
  );
}

export default CustomerView;
