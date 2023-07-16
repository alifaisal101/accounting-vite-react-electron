import './ContentContainer.css';

function ContentContainer(props) {
  return (
    <div className={props.className + ' content-container'}>
      {props.children}
    </div>
  );
}

export default ContentContainer;
