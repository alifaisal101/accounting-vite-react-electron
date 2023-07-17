import './Btn.css';

function Btn(props) {
  return (
    <div className={'gbtn ' + props.className} onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export default Btn;
