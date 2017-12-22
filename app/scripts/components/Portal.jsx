import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import uuid from 'uuid/v4';
import { canUseDOM } from 'utils/helpers';

import Transition from 'components/Transition';

class Portal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    closeOnClickOverlay: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    id: PropTypes.string,
    isActive: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    showCloseButton: PropTypes.bool,
    showOverlay: PropTypes.bool,
    transitionClassName: PropTypes.string,
  };

  static defaultProps = {
    closeOnEsc: true,
    closeOnClickOverlay: true,
    id: uuid(),
    isActive: false,
    showCloseButton: true,
    showOverlay: true,
    transitionClassName: 'transition-slide-down',
  };

  componentDidMount() {
    if (!canUseDOM) return;

    const { closeOnEsc, id, isActive } = this.props;

    this.portal = document.createElement('div');
    this.portal.id = id;

    document.body.appendChild(this.portal);

    if (isActive && closeOnEsc) {
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!canUseDOM) return;

    const { isActive } = this.props;

    if (!isActive && nextProps.isActive) {
      this.openPortal();
    } else if (isActive && !nextProps.isActive) {
      this.destroyPortal();
    }
  }

  componentWillUnmount() {
    if (!canUseDOM || !this.portal) return;

    document.body.removeChild(this.portal);
  }

  openPortal() {
    const { closeOnEsc, onOpen } = this.props;

    if (typeof onOpen === 'function') {
      onOpen();
    }

    if (closeOnEsc) {
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  closePortal() {
    const { onClose } = this.props;

    if (typeof onClose === 'function') {
      onClose(this.portal);
    }
  }

  destroyPortal() {
    const { closeOnEsc } = this.props;

    if (closeOnEsc) {
      document.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  handleClickClose = (e) => {
    const el = e.currentTarget;
    const { closeOnClickOverlay } = this.props;

    if (el.className.includes('overlay') && !closeOnClickOverlay) {
      return;
    }

    this.closePortal();
  };

  handleKeyUp = (e) => {
    /* istanbul ignore else */
    if (e.keyCode === 27) {
      this.closePortal();
    }
  };

  render() {
    if (!canUseDOM) return null;

    if (!this.portal) {
      this.portal = document.createElement('div');
    }

    const { children, isActive, showCloseButton, showOverlay, transitionClassName } = this.props;
    const content = [];

    if (isActive) {
      content.push(children);
    }

    return ReactDOM.createPortal(
      <div
        key="Portal"
        className={cx('app__portal', {
          'app__portal--is-open': isActive,
        })}
      >
        {showOverlay && (
          <div
            className="app__portal__overlay"
            onClick={this.handleClickClose}
          />
        )}
        {showCloseButton && (
          <button className="app__portal__close" onClick={this.handleClickClose}>
            <i className="i-close" />
          </button>
        )}
        <div className="app__portal__content">
          <Transition classNames={transitionClassName}>
            {content}
          </Transition>
        </div>
      </div>,
      this.portal);
  }
}

export default Portal;
