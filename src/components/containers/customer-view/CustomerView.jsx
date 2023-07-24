import { useEffect, useState } from 'react';
import PrintCustomer from '../print-customer/PrintCustomer';
import './CustomerView.css';

function CustomerView(props) {
  const [Customer, setCustomer] = useState({});

  useEffect(() => {
    e_customers.fetchCustomer(true, props._id, (err, result) => {
      if (err) {
        return alert('فشل سحب الزبون');
      }

      if (result) {
        console.log(result);
      }
    });
  }, []);
  return (
    <div>
      {props._id}

      <PrintCustomer />
    </div>
  );
}

export default CustomerView;
