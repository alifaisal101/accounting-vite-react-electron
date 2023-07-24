import { useEffect, useState } from 'react';
import PrintCustomer from '../print-customer/PrintCustomer';
import './CustomerView.css';

function CustomerView(props) {
  const [Customer, setCustomer] = useState({});

  useEffect(() => {}, []);
  return (
    <div>
      {props._id}

      <PrintCustomer />
    </div>
  );
}

export default CustomerView;
