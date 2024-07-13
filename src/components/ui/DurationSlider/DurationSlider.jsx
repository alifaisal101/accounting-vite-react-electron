import './__DurationSlider.css'; // Create a CSS file for styling
import { Slider } from '@mui/material';

const DurationSlider = (props) => {
  let classes = 'slider';
  if (props.disabled) classes += ' disabled';

  return (
    <div className="duration-slider">
      <div className="slider-container" dir="ltr">
        <span className="slider-range-text">1 يوم</span>
        <Slider
          value={props.value}
          onChange={props.onChange}
          aria-label="Default"
          valueLabelDisplay="auto"
          className={classes}
          name="slider"
          max={120}
          min={1}
          direction="column"
          disabled={props.disabled}
        />
        <span className="slider-range-text">120 يوم</span>
      </div>
    </div>
  );
};

export default DurationSlider;
