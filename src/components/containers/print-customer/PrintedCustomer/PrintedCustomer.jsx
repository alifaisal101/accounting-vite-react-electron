import './PrintedCustomer.css';

import React from 'react';
import CustomerPurchases from './_CustomerPurchases';

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
      <div className="printed-customer" dir="rtl">
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
          <div className="printed-customer_officeInfo_name-location">
            <div className="printed-customer_officeInfo_name-location_name">
              {this.printSettings?.shopName ? this.printSettings.shopName : ''}
            </div>
            <div className="printed-customer_officeInfo_name-location_location">
              {this.printSettings.firstPhoneNumber ||
              this.printSettings.secondPhoneNumber ? (
                <p>
                  أرقام الهاتف: {this.printSettings.firstPhoneNumber},{' '}
                  {this.printSettings.secondPhoneNumber}
                </p>
              ) : null}
              {this.printSettings.firstAddress ||
              this.printSettings.secondAddress ? (
                <div>
                  {this.printSettings.firstAddress ? (
                    <p>العنوان الأول: {this.printSettings.firstAddress}</p>
                  ) : null}
                  {this.printSettings.secondAddress ? (
                    <p>العنوان الثاني: {this.printSettings.secondAddress}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="printed-customer_customerInfo">
          <div className="printed-customer_customerInfo_item">
            الزبون المحترم: {this.customer.name}
          </div>
          <div className="printed-customer_customerInfo_item">
            الهاتف: {this.customer.phoneNumber}
          </div>
          <div className="printed-customer_customerInfo_item">
            مجموع كلفة المشتريات: {this.customer.totalPurchasesCosts} دينار
          </div>
          <div className="printed-customer_customerInfo_item">
            مجموع الديون: {this.customer.totalDebt} دينار
          </div>
        </div>
        <p className="printed-customer_sub-title">الملاحظات:</p>
        <p className="printed-customer_notes">{this.customer.notes}</p>
        <p className="printed-customer_sub-title">المشتريات:</p>
        <CustomerPurchases purchases={this.customer.purchases} />
      </div>
    );
  }
}

export default PrintedCustomer;
