import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import config from 'config';

const Logo = ({ icon }) => {
  const type = icon ? 'icon' : 'full';
  const images = {
    icon: [
      require('assets/media/brand/icon.svg'),
      require('assets/media/brand/icon.png'),
    ],
    full: [
      require('assets/media/brand/logo.svg'),
      require('assets/media/brand/logo.png'),
    ],
  };

  return (
    <div className="app__logo">
      <SVG
        key={type}
        className={`app__logo__${type}`}
        src={images[type][0]}
        cacheGetRequests={true}
      >
        <img src={images[type][1]} alt={config.title} />
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
