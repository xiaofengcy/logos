import React from 'react';
import Isvg from 'react-inlinesvg';

import config from 'config';

const Logo = ({ icon }) => {
  let html;

  if (icon) {
    html = (<Isvg key="icon" className="app__logo__icon" src={require('assets/media/brand/icon.svg')}>
      <img src={require('assets/media/brand/icon.png')} alt={config.title} />
    </Isvg>);
  } else {
    html = (
      <Isvg key="full" className="app__logo__full" src={require('assets/media/brand/logo.svg')}>
        <img src={require('assets/media/brand/logo.png')} alt={config.title} />
      </Isvg>);
  }

  return (<div className="app__logo">
    {html}
  </div>);
};

Logo.propTypes = {
  icon: React.PropTypes.bool,
};

Logo.defaultProps = {
  icon: false,
};

export default Logo;
