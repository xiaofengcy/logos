import React from 'react';
import { connect } from 'react-redux';
import Transition from 'react-addons-css-transition-group';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Splash from 'components/Splash';
import SystemNotifications from 'components/SystemNotifications';

export class AppPublic extends React.PureComponent {
  static propTypes = {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    firebase: React.PropTypes.object.isRequired,
  };

  render() {
    const { app, firebase, dispatch } = this.props;
    let splash;

    if (!firebase.ready) {
      splash = (<Splash />);
    }

    return (
      <div key="app" className="app app--public">
        <Header app={app} dispatch={dispatch} firebase={firebase} />
        <main className="app__main">
          {this.props.children}
        </main>
        <Transition
          component="div"
          transitionName="splash__animation"
          transitionEnterTimeout={1500}
          transitionLeaveTimeout={1500}
        >
          {splash}
        </Transition>
        <Footer dispatch={dispatch} />
        <SystemNotifications />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
    firebase: state.firebase,
  };
}

export default connect(mapStateToProps)(AppPublic);

