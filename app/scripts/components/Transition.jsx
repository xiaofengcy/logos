import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Transition = ({ children, className, style, ...rest }) => (
  <TransitionGroup className={className} style={style}>
    {React.Children.map(children, child => (<CSSTransition {...rest}>{child}</CSSTransition>))}
  </TransitionGroup>
);

Transition.propTypes = {
  appear: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  classNames: PropTypes.string,
  enter: PropTypes.bool,
  exit: PropTypes.bool,
  style: PropTypes.object,
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
  transitionName: PropTypes.string,
};

Transition.defaultProps = {
  appear: true,
  className: 'app__transition',
  classNames: 'transition-fade',
  enter: true,
  exit: true,
  style: { position: 'relative' },
  timeout: 300,
};

export default Transition;
