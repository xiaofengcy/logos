import React from 'react';
import PropTypes from 'prop-types';

import { hideAlert } from 'actions';

import Transition from 'components/Transition';
import Alert from 'components/Alert';

export default class SystemAlerts extends React.Component {
  constructor(props) {
    super(props);

    this.timeouts = {};
  }

  static propTypes = {
    alerts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { alerts: nextAlerts, dispatch } = nextProps;

    /* istanbul ignore else */
    if (nextAlerts.length) {
      nextAlerts.forEach(d => {
        if (d.timeout && !this.timeouts[d.id]) {
          this.timeouts[d.id] = setTimeout(() => {
            dispatch(hideAlert(d.id));
          }, d.timeout * 1000);
        }
      });
    }
  }

  componentWillUnmount() {
    Object.keys(this.timeouts).forEach(d => {
      clearTimeout(this.timeouts[d]);
    });
  }

  handleClick = (e) => {
    e.preventDefault();
    const { dataset } = e.currentTarget;
    const { dispatch } = this.props;

    dispatch(hideAlert(dataset.id));
  };

  renderAlert(data) {
    return (
      <Alert
        key={data.id}
        id={data.id}
        icon={data.icon}
        handleClickClose={this.handleClick}
        type={data.type}
      >
        {data.message}
      </Alert>
    );
  }

  render() {
    const { alerts } = this.props;
    const top = alerts.filter(d => d.position === 'top');
    const topLeft = alerts.filter(d => d.position === 'top-left');
    const topRight = alerts.filter(d => d.position === 'top-right');
    const bottom = alerts.filter(d => d.position === 'bottom');
    const bottomLeft = alerts.filter(d => d.position === 'bottom-left');
    const bottomRight = alerts.filter(d => d.position === 'bottom-right');

    return (
      <div key="SystemAlerts" className="app__system-alerts">
        <div className="app__system-alerts__top">
          <Transition classNames="transition-slide-down">
            {top.map(d => this.renderAlert(d))}
          </Transition>
        </div>
        <div className="app__system-alerts__top-left">
          <Transition classNames="transition-slide-right">
            {topLeft.map(d => this.renderAlert(d))}
          </Transition>
        </div>
        <div className="app__system-alerts__top-right">
          <Transition classNames="transition-slide-left">
            {topRight.map(d => this.renderAlert(d))}
          </Transition>
        </div>
        <div className="app__system-alerts__bottom">
          <Transition classNames="transition-slide-up">
            {bottom.map(d => this.renderAlert(d))}
          </Transition>
        </div>
        <div className="app__system-alerts__bottom-left">
          <Transition classNames="transition-slide-right">
            {bottomLeft.map(d => this.renderAlert(d))}
          </Transition>
        </div>
        <div className="app__system-alerts__bottom-right">
          <Transition classNames="transition-slide-left">
            {bottomRight.map(d => this.renderAlert(d))}
          </Transition>
        </div>
      </div>
    );
  }
}
