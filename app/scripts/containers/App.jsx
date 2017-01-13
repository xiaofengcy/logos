import React from 'react';
import { autobind, debounce } from 'core-decorators';
import { connect } from 'react-redux';

import { initFirebase, detectMobile } from 'actions';

export class App extends React.PureComponent {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.dispatch(initFirebase());
  }

  componentDidMount() {
    global.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    global.removeEventListener('resize', this.handleResize);
  }

  @autobind
  @debounce(300)
  handleResize() {
    this.props.dispatch(detectMobile(window.innerWidth <= 700));
  }

  render() {
    return this.props.children;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { app: state.app };
}

export default connect(mapStateToProps)(App);
