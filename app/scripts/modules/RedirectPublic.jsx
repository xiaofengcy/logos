import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const RedirectPublic = ({ component: Component, isAuthenticated, to, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated
        ? (<Redirect to={to} />)
        : (<Component {...props} />)
    )}
  />
);

RedirectPublic.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  to: PropTypes.string,
};

RedirectPublic.defaultProps = {
  to: '/cms',
};

export default RedirectPublic;
