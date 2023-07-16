import './DropdownContainer.css';

function DropdownContainer(props) {
  return (
    <div className={'dropdown-container ' + props.className}>
      <div className="dropdown-card" dir="rtl">
        <div className="close-btn-container">
          <button onClick={props.closeHandler}>×</button>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default DropdownContainer;
