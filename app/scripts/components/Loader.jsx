import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Loader = ({ grow, pulse }) => {
  let html;

  if (pulse) {
    html = (<div />);
  } else {
    html = (
      <svg className="loader__svg">
        <circle
          className="loader__circle"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <div
      className={cx('app__loader', {
        'app__loader--pulse': pulse,
        'app__loader--rotate': !pulse,
        'app__loader--grow': grow,
      })}
    >
      {html}
    </div>
  );
};

Loader.propTypes = {
  grow: PropTypes.bool,
  pulse: PropTypes.bool,
};

Loader.defaultProps = {
  grow: false,
  pulse: true,
};

export default Loader;
