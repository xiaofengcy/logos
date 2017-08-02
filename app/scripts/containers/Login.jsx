import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { login } from 'actions';

export class Login extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  handleClickLogin = (e) => {
    e.preventDefault();
    const { provider } = e.currentTarget.dataset;

    this.props.dispatch(login(provider));
  };

  render() {
    const { user } = this.props;
    let message;

    if (user.isAuthenticated && !user.isAdmin) {
      message = (<div>Invalid credentials</div>);
    }

    return (
      <div key="Login" className="app__login app__route">
        <div className="app__container">
          <div className="app__login__wrapper">
            <a
              href="#login"
              onClick={this.handleClickLogin}
              className="btn btn-lg btn-primary btn-icon"
              data-provider="github"
            >
              <i className="i-github" />
              <span>Login</span>
            </a>

            <a
              href="#login"
              onClick={this.handleClickLogin}
              className="btn btn-lg btn-primary btn-icon"
              data-provider="facebook"
            >
              <i className="i-facebook" />
              <span>Login</span>
            </a>
            {message}
          </div>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Login);
