import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import config from 'config';

const Logo = ({ icon }) => {
  const type = icon ? 'icon' : 'full';
  const images = [
    require('assets/media/brand/icon.svg'),
    require('assets/media/brand/icon.png'),
  ];

  return (
    <div className="app__logo">
      <SVG
        key={type}
        className={`app__logo__${type}`}
        src={images[0]}
        cacheGetRequests={true}
      >
        <img src={images[1]} alt={config.title} />
      </SVG>
    </div>
  );
};

Logo.propTypes = {
  icon: PropTypes.bool,
};

Logo.defaultProps = {
  icon: false,
};

export default Logo;
