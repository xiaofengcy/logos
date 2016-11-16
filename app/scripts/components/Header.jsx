import React from 'react';
import { autobind, debounce } from 'core-decorators';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';
import { shouldComponentUpdate, trackEvent } from 'utils/helpers';

import { filterItems } from 'actions';

import Logo from 'components/Logo';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false,
      search: '',
    };
  }

  static propTypes = {
    app: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    const { app: { filter } } = this.props;

    this.setState({
      search: filter.search,
    });
  }

  componentDidMount() {
    global.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter } } = this.props;
    const { app: { filter } } = nextProps;

    if (prevFilter.search !== filter.search) {
      this.setState({
        search: filter.search,
      });
    }
  }

  componentWillUnmount() {
    global.removeEventListener('scroll', this.handleScroll);
  }

  @autobind
  handleClickLogo(e) {
    e.preventDefault();
    this.props.dispatch(filterItems({}));
  }

  @autobind
  handleScroll() {
    const innerHeader = document.querySelector('.app__items__header').getBoundingClientRect();
    const { scrolled } = this.state;

    if (global.scrollY >= innerHeader.height + 30 && !scrolled) {
      this.setState({
        scrolled: true,
      });
    } else if (global.scrollY < innerHeader.height + 30 && scrolled) {
      this.setState({
        scrolled: false,
      });
    }
  }

  @autobind
  handleSearch(e) {
    let search = '';

    if (e.type === 'click') {
      e.preventDefault();
      e.currentTarget.parentNode.previousSibling.focus();
    } else if (e.type === 'change') {
      search = e.target.value;
    }

    this.setState({ search });
    this.executeSearch(search);
  }

  @debounce(300)
  executeSearch(search) {
    this.props.dispatch(filterItems({ search }));

    if (search) {
      trackEvent('search', 'submit', search);
    }
  }

  render() {
    const { search, scrolled } = this.state;
    const { app: { filter, isMobile } } = this.props;

    const searchComponent = (
      <div className="app__header__search">
        <input
          type="text"
          name="search"
          value={search}
          placeholder="Search..."
          onChange={this.handleSearch}
        />
        <span className="input-icon">
          {filter.search ?
           (<a href="#clean" onClick={this.handleSearch}>
             <i className="i-remove" />
           </a>)
            : <i className="i-search" />
          }
        </span>
      </div>
    );

    return (
      <header
        className={cx('app__header', { 'app__header--scrolled': scrolled })}
      >
        <div className="app__container">
          <a href="/" className="app__header__logo" onClick={this.handleClickLogo}>
            <Logo icon={isMobile ? scrolled : isMobile} />
          </a>
          <Transition
            component="div"
            transitionName="transition__fade"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={isMobile ? 0 : 1000}
          >
            { scrolled ? searchComponent : null}
          </Transition>
          <div className="app__header__social">
            <a href="https://twitter.com/intent/follow?screen_name=svgporn" target="_blank">
              <i className="i-twitter" />
            </a>
            <a href="https://www.facebook.com/svgporn" target="_blank">
              <i className="i-facebook" />
            </a>
            <a href="https://github.com/gilbarbara/logos" target="_blank">
              <i className="i-github" />
            </a>
          </div>
        </div>
      </header>
    );
  }
}
