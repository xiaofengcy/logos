import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Debounce } from 'lodash-decorators';
import history from 'modules/history';
import RedirectProtected from 'modules/RedirectProtected';
import RedirectPublic from 'modules/RedirectPublic';

import { initFirebase, detectMobile, restore } from 'actions';

import CMS from 'containers/CMS';
import Items from 'containers/Items';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

import Footer from 'components/Footer';
import Header from 'components/Header';
import Loader from 'components/Loader';
import Splash from 'components/Splash';
import SystemAlerts from 'components/SystemAlerts';
import Transition from 'components/Transition';

export class App extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(initFirebase());

    if (location.pathname === '/cms') {
      dispatch(restore());
    }

    global.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    global.removeEventListener('resize', this.handleResize);
  }

  @Debounce(300)
  handleResize = () => {
    this.props.dispatch(detectMobile(window.innerWidth <= 700));
  };

  render() {
    const { app, firebase, dispatch, user } = this.props;
    const isPublic = location.pathname !== '/cms';
    const output = {
      html: (<Loader type="logo" grow={true} />),
      splash: [],
    };

    if (!firebase.isReady) {
      output.splash.push(<Splash key="Splash" />);
    }

    if (app.rehydrated) {
      output.html = (
        <ConnectedRouter history={history}>
          <div className="app">
            {isPublic && <Header app={app} dispatch={dispatch} firebase={firebase} />}
            <main className="app__main">
              <Switch>
                <Route exact path="/" component={Items} />
                <RedirectPublic
                  exact
                  path="/login"
                  component={Login}
                  isAuthenticated={user.isAuthenticated}
                />
                <RedirectProtected
                  path="/cms"
                  component={CMS}
                  isAuthenticated={user.isAuthenticated}
                />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Transition classNames="splash__animation" timeout={1100}>
              {output.splash}
            </Transition>
            {isPublic && (<Footer dispatch={dispatch} />)}
            <SystemAlerts alerts={app.alerts} dispatch={dispatch} />
          </div>
        </ConnectedRouter>
      );
    }

    return (
      <div key="App">
        {output.html}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
    firebase: state.firebase,
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
