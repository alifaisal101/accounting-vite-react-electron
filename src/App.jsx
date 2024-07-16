import './App.css';

// App Content
import Logo from './components/ui/logo/Logo';
import ContentContainer from './components/ui/content-container/ContentContainer';
import ActionButton from './components/containers/action-button/ActionButton';
import SideNav from './components/containers/sidenav/SideNav';
import Overlay from './components/ui/overlay/Overlay';

// Pages main content
import Products from './pages/products/Products';
import Customers from './pages/customers/Customers';

// components dropdown
import CustomersForm from './components/containers/customersform/CustomersForm';

import { useEffect, useState } from 'react';
import DropdownContainer from './components/ui/dropdown-container/DropdownContainer';
import ProductForm from './components/containers/productsform/ProductForm';
import PrintSettings from './pages/print-settings/PrintSettings';
import CustomerView from './components/containers/customer-view/CustomerView';
import Backups from './pages/backups/Backups';
import BackupForm from './components/containers/backup-form/BackupForm';
import { useRecoilState } from 'recoil';
import { osPlatformState } from './store/os.store';

function App() {
  const [osPlatform, setOsPlatform] = useRecoilState(osPlatformState);

  // Set the OS platform global state
  useEffect(() => {
    e_util.getOsPlatform((err, result) => {
      if (err) {
        return alert(
          'فشل سحب نوع نظام التشغيل في الكومبيوتر. غالبا سيعطل هذا الخطا عمليات النسخ الاحتياطي'
        );
      }
      setOsPlatform(result);
    });
  }, []);

  // Page Handling
  const [showContent, setShowContent] = useState(false);
  const [page, setPage] = useState('');
  const [customerId, setCustomerId] = useState('');

  let onSaveProduct = () => {};

  function contentHandler(page) {
    setShowContent(false);
    setTimeout(() => setShowContent(true), 250);
    setPage(page);
  }

  let PageComp;
  switch (page) {
    case 'productsMenu':
      PageComp = (
        <Products
          action={() => dropdownHandler('add-product')}
          onAddProduct={(cb) => {
            onSaveProduct = cb;
          }}
        />
      );
      break;
    case 'customersMenu':
      PageComp = (
        <Customers
          action={(_id) => {
            setCustomerId(_id);
            dropdownHandler('view-customer');
          }}
          unmountContentContainer={() => {
            contentHandler('');
            setTimeout(() => {
              contentHandler('customersMenu');
            }, 50);
          }}
        />
      );
      break;

    case 'printSettings':
      PageComp = <PrintSettings />;
      break;

    case 'backups':
      PageComp = <Backups action={() => dropdownHandler('add-backup')} />;
      break;
  }

  //Dropdown Handling

  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownContent, setDropdownContent] = useState('');

  function dropdownHandler(_dropdownContent) {
    setDisplayOverlay(true);
    setShowDropdown(true);
    setDropdownContent(_dropdownContent);
    document.body.style.overflow = 'hidden';
  }

  function cancelDropdownHandler() {
    setDisplayOverlay(false);
    setShowDropdown(false);
    setDropdownContent();
    document.body.style.overflow = 'auto';
  }

  let DropdownContentComp;
  switch (dropdownContent) {
    case 'customerForm':
      DropdownContentComp = (
        <CustomersForm
          unmountContentContainer={() => {
            contentHandler('');
            setTimeout(() => {
              contentHandler('customersMenu');
            }, 250);
          }}
        />
      );
      break;
    case 'add-product':
      DropdownContentComp = (
        <ProductForm
          onSaveProduct={(product) => {
            onSaveProduct(product);
          }}
        />
      );
      break;
    case 'view-customer':
      DropdownContentComp = (
        <CustomerView
          _id={customerId}
          unmountContentContainer={() => {
            contentHandler('');
            setCustomerId('');
            setTimeout(() => {
              contentHandler('customersMenu');
            }, 250);
          }}
          unmountDropdown={() => {
            cancelDropdownHandler();
            setCustomerId('');
          }}
          unmountAndMountDropdown={() => {
            contentHandler('');
            setTimeout(() => {
              contentHandler('backups');
            }, 250);
          }}
        />
      );
      break;
    case 'add-backup':
      DropdownContentComp = (
        <BackupForm
          onSaveBackup={() => {
            contentHandler('');
            cancelDropdownHandler();
            setTimeout(() => {
              contentHandler('backups');
            }, 250);
          }}
        />
      );
  }

  return (
    <div className="App">
      <div className="main-content">
        <Logo />
        <ContentContainer className={showContent ? 'bringFromTheLeft' : ''}>
          {PageComp}
        </ContentContainer>
      </div>
      <div className="main-nav">
        <ActionButton action={() => dropdownHandler('customerForm')} />
        <SideNav setPage={contentHandler} />
      </div>
      {displayOverlay ? <Overlay /> : null}
      <DropdownContainer
        closeHandler={cancelDropdownHandler}
        className={showDropdown ? 'bringFromTheTop' : ''}
      >
        {DropdownContentComp}
      </DropdownContainer>
    </div>
  );
}

export default App;
