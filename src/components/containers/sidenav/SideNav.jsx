import './SideNav.css';

function SideNav(props) {
  return (
    <div className="sidenav" dir="rtl">
      <ul>
        <li onClick={() => props.setPage('productsMenu')}>قائمة السلع</li>
        <li onClick={() => props.setPage('customersMenu')}>قائمة الزبائن</li>

        <li onClick={() => props.setPage('printSettings')}>اعدادات الطباعة</li>
      </ul>
    </div>
  );
}

export default SideNav;
