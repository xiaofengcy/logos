import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import config from 'config';

const Logo = ({ icon }) => {
  let html;

  if (icon) {
    html = (
      <SVG key="icon" className="app__logo__icon" src={require('assets/media/brand/icon.svg')}>
        <img src={require('assets/media/brand/icon.png')} alt={config.title} />
      </SVG>
    );
  } else {
    html = (
      <SVG key="full" className="app__logo__full" src={require('assets/media/brand/logo.svg')}>
        <img src={require('assets/media/brand/logo.png')} alt={config.title} />
      </SVG>
    );
  }

  return (
    <div className="app__logo">
      {html}
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
