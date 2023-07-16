import './SideNav.css';

function SideNav(props) {
  return (
    <div className="sidenav" dir="rtl">
      <ul>
        <li onClick={() => props.setPage('productsMenu')}>قائمة السلع</li>
        <li onClick={() => props.setPage('customersMenu')}>قائمة الزبائن</li>
        <li onClick={() => props.setPage('customersByDate')}>
          الزبائن حسب التقويم
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
