import './ActionButton.css';

function ActionButton(props) {
  return (
    <div className="action-button" onClick={props.action}>
      اضافة زبون
    </div>
  );
}

export default ActionButton;
