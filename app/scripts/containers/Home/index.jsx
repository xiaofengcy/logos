import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import _reduce from 'lodash/reduce';
import _orderBy from 'lodash/orderBy';
import Waypoint from 'react-waypoint';
import { scrollTo, trackEvent } from 'utils/helpers';

import { filterItems } from 'actions';

import Item from './Item';

export class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.viewTypes = {
      all: 'All Logos',
      favorites: 'Favorites',
      latest: 'Latest',
      vectorized: 'Vectorized',
    };

    this.state = {
      limit: 50,
      logos: [],
      page: 1,
      scrollable: false,
    };

    this.$app = document.querySelector('.app--public');
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.object.isRequired,
  };

  componentWillMount() {
    if (this.props.firebase.isReady) {
      this.setProperties();
      this.setLogos();
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    if (!this.props.firebase.isReady && this.$app) {
      document.querySelector('.app--public').classList.add('app--loading');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter }, firebase: prevFirebase } = this.props;
    const { app: { filter }, firebase } = nextProps;

    if (!prevFirebase.isReady && firebase.isReady) {
      this.setProperties();
      this.setLogos();

      if (this.$app) {
        document.querySelector('.app--public').classList.remove('app--loading');
      }

      return;
    }

    if (
      prevFilter.view !== filter.view
      || (filter.tag || prevFilter.tag !== filter.tag)
      || (filter.category || prevFilter.category !== filter.category)
      || (filter.search || prevFilter.search !== filter.search)
    ) {
      this.setState({
        page: 1,
      }, this.setLogos);
    }

    if (filter.showTags) {
      document.body.style.overflow = 'hidden';
    } else if (prevFilter.showTags && !filter.showTags) {
      document.body.style.overflow = 'auto';
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.removeEventListener('keydown', this.handleKeyboard);
  }

  setProperties() {
    const { categories, tags } = this.props.firebase;
    this.tags = _reduce(tags.data, (res, val) => {
      res[val.name] = val.count;
      return res;
    }, {});

    this.categories = _reduce(categories.data, (res, val) => {
      res[val.name] = val.count;
      return res;
    }, {});
  }

  setLogos() {
    const { app: { filter }, firebase } = this.props;
    let logos;

    switch (filter.view) {
      case 'favorites': {
        logos = _orderBy([...firebase.logos.data], ['shortname'], ['asc']).filter(d => d.favorite);
        break;
      }
      case 'vectorized': {
        logos = _orderBy([...firebase.logos.data], ['shortname'], ['asc']).filter(d => d.vectorized);
        break;
      }
      case 'all': {
        logos = _orderBy([...firebase.logos.data], ['shortname'], ['asc']);
        break;
      }
      default: {
        logos = _orderBy([...firebase.logos.data], ['updated', 'name'], ['desc', 'asc']);
        break;
      }
    }

    if (filter.tag) {
      logos = logos.filter(d => d.tags.includes(filter.tag));
    } else if (filter.category) {
      logos = logos.filter(d => d.categories.includes(filter.category));
    } else if (filter.search) {
      logos = logos.filter(d => d.name.includes(filter.search) || d.shortname.includes(filter.search));
    }

    logos = logos.filter(d => d.public);

    this.setState({
      logos,
    });
  }

  handleScroll = (e) => {
    const { app: { filter } } = this.props;
    if ((document.body.scrollTop >= 1000 && document.body.clientHeight > 4000) && !filter.showTags && !this.state.scrollable) {
      this.setState({
        scrollable: true,
      });
    } else if (e.target.body.scrollTop < 1000 && this.state.scrollable) {
      this.setState({
        scrollable: false,
      });
    }
  };

  handleClickTag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { name } = e.currentTarget.dataset;
    scrollTo();

    this.props.dispatch(filterItems({ tag: name }));
    trackEvent('tag', 'click', name);
  };

  handleCleanFilter = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(filterItems({}));
  };

  handleWaypoint = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  renderWaypoint() {
    const { limit, logos, page } = this.state;

    if (page * limit > logos.length) {
      return false;
    }

    return (<Waypoint bottomOffset="-90%" fireOnRapidScroll={false} onEnter={this.handleWaypoint} />);
  }

  render() {
    const { limit, logos, page } = this.state;
    const { app, firebase } = this.props;
    const { filter } = app;
    const output = {};

    if (firebase.isReady) {
      output.items = logos.slice(0, limit * page).map(d =>
        d.files.map((f, i) =>
          (<Item key={`${d.id}-${i}`} handleClickTag={this.handleClickTag} data={d} index={i} />)
        )
      );

      if (filter.category) {
        output.filteredTitle = `[${filter.category}]`;
      } else if (filter.tag) {
        output.filteredTitle = `#${filter.tag}`;
      } else if (filter.search) {
        output.filteredTitle = `results for: ${filter.search}`;
      }

      if (filter.category || filter.tag || filter.search) {
        output.title = (
          <h2>
            <span>{output.filteredTitle} ({logos.length})</span>
            <a href="#remove" onClick={this.handleCleanFilter}><i className="i-times-circle" /></a>
          </h2>
        );
      } else if (filter.view !== 'all' && filter.view !== 'latest') {
        output.title = (
          <h2>
            <span>{this.viewTypes[filter.view]} ({logos.length})</span>
          </h2>);
      }

      output.heading = (
        <div className="app__home__heading">{output.title}</div>
      );

      output.logos = (
        <ul
          className={cx(`app__images app__images--${filter.columns}`, {
            empty: !logos.length,
          })}
        >
          {output.items}
        </ul>
      );
    }

    return (
      <div key="Home" className="app__home app__route">
        {output.heading}
        {output.logos}
        {this.renderWaypoint()}
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

export default connect(mapStateToProps)(Home);
