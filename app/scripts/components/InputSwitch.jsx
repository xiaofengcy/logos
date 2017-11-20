import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function InputSwitch(props) {
  const handleClick = () => {
    if (props.onChange) {
      props.onChange(!props.value);
    }
  };

  const className = cx('u-switch', {
    'is-checked': props.value,
  }, props.className);

  return (
    <div
      className={className}
      onClick={handleClick}
    >
      <input
        type="hidden"
        name={props.name}
        value={props.value}
      />
      <span className="track" />
      <span className="button" />
    </div>
  );
}

InputSwitch.defaultProps = {
  value: false,
};

InputSwitch.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

export default InputSwitch;
