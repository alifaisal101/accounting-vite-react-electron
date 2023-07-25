import './PrintedCustomer.css';

import React from 'react';

class PrintedCustomer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.customer = props.customer;
    this.printSettings = props.printSettings;
    this.logoExists = false;
    if (this.printSettings?.imageUrl) {
      this.logoExists = true;
    }
  }

  render() {
    return (
      <div className="printed-customer">
        <div className="printed-customer_officeInfo">
          {this.logoExists ? (
            <div className="printed-customer_officeInfo_imageContainer">
              <img
                className="printed-customer_officeInfo_imageContainer_image"
                src={this.printSettings.imageUrl}
                alt={this.printSettings.shopName}
              />
            </div>
          ) : null}
        </div>
        <div className="printed-customer_clientPersonalInfo"></div>
      </div>
    );
  }
}

export default PrintedCustomer;
