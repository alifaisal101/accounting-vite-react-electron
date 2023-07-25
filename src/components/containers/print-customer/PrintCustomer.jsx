import './PrintCustomer.css';

import React from 'react';
import ReactToPrint from 'react-to-print';

import PrintedCustomer from './PrintedCustomer/PrintedCustomer';
import Btn from '../../ui/btn/Btn';

class PrintCustomer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.customer = props.customer;
    this.printSettings = props.printSettings;
  }
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <Btn className="printCustomer-btn">طباعة</Btn>;
          }}
          content={() => this.componentRef}
        />

        <PrintedCustomer
          customer={this.customer}
          printSettings={this.printSettings}
          ref={(el) => (this.componentRef = el)}
        />
      </div>
    );
  }
}

export default PrintCustomer;
