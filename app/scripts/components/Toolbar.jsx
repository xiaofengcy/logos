import React from 'react';
import PropTypes from 'prop-types';
import { Debounce } from 'lodash-decorators';
import cx from 'classnames';
import { scrollTo, trackEvent } from 'utils/helpers';

import { filterItems } from 'actions/index';
import ComboBox from 'react-widgets/lib/Combobox';

export default class Toolbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      category: 'Categories',
      search: '',
    };
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { app: { filter }, firebase: { tags } } = this.props;
    const fScale = {
      min: 1,
      max: 0,
      unit: 'rem',
      maxSize: 4,
    };

    tags.data.forEach(t => {
      if (t.count < fScale.min) {
        fScale.min = t.count;
      }

      if (t.count > fScale.max) {
        fScale.max = t.count;
      }
    });

    this.setState({
      category: filter.category || 'Categories',
      search: filter.search,
    });
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyboard);
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter } } = this.props;
    const { app: { filter } } = nextProps;
    const newState = {};

    if (prevFilter.category !== filter.category) {
      newState.category = filter.category || 'Categories';
    }

    if (prevFilter.search !== filter.search) {
      newState.search = filter.search;
    }

    this.setState(newState);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyboard);
  }

  handleSearch = (e) => {
    let search = '';

    if (e.type === 'click') {
      e.preventDefault();
      e.currentTarget.parentNode.previousSibling.focus();
    } else if (e.type === 'change') {
      search = e.target.value;
    }

    this.setState({ search });
    this.executeSearch(search);
  };

  @Debounce(300)
  executeSearch = (search) => {
    this.props.dispatch(filterItems({ search }));

    if (search) {
      trackEvent('search', 'submit', search);
    }
  };

  handleSelectCategory = (data) => {
    this.props.dispatch(filterItems({ category: data.name !== 'Categories' ? data.name : '' }));

    trackEvent('category', 'click', data.name);
  };

  handleClickChangeView = (e) => {
    e.preventDefault();

    const { value: view } = e.currentTarget.dataset;

    this.props.dispatch(filterItems({ view }));
    trackEvent('view', 'click', view);
  };

  handleClickTags = (e) => {
    const { app: { filter }, dispatch } = this.props;
    if (e) {
      e.preventDefault();
    }

    dispatch(filterItems({
      showTags: !filter.showTags,
    }));

    if (!filter.showTags) {
      trackEvent('tag-cloud', 'click');
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

  handleKeyboard = (e) => {
    const { app: { filter } } = this.props;
    const intKey = (window.Event) ? e.which : e.keyCode;
    let action;

    if ((intKey === 189 || intKey === 109) && filter.columns > 1) {
      this.handleChangeColumns(filter.columns - 1);
      action = 'column-down';
    }

    if ((intKey === 187 || intKey === 107) && filter.columns < 5) {
      this.handleChangeColumns(filter.columns + 1);
      action = 'column-up';
    }
    if (intKey === 27) {
      if (filter.showTags) {
        this.props.dispatch(filterItems({ showTags: false }));
      }

      action = 'escape';
    }

    if (action) {
      trackEvent('keyboard', 'press', action);
    }
  };

  handleClickColumns = (e) => {
    e.preventDefault();
    const { app: { filter } } = this.props;

    this.changeColumns((filter.columns || 3) + Number(e.currentTarget.dataset.column));
  };

  changeColumns(columns) {
    this.props.dispatch(filterItems({
      columns,
    }));
  }

  render() {
    const { category, search } = this.state;
    const {
      app: { filter },
      firebase: {
        logos,
        tags,
        categories,
      },
    } = this.props;
    const output = {};
    let classes;

    const categoriesMenu = [{ name: 'Categories', count: 0 }].concat(categories.data);

    output.tagsMenu = (
      <li className="app__toolbar__tags">
        <a
          href="#tags"
          className={cx('btn btn-white btn-icon', { tagged: filter.tag })}
          onClick={this.handleClickTags}
        >
          <i className="i-tags" /><span>Tags</span>
        </a>
      </li>
    );

    output.tagCloud = (
      <div className={cx('app__toolbar__cloud', { visible: filter.showTags })} onClick={this.handleClickTags}>
        <div className="app__toolbar__cloud__wrapper">
          {tags.data.map(d => {
            switch (Math.min(Math.ceil(d.count < 5 ? 0 : d.count / 10), 5)) {
              case 5:
                classes = 'tag-size-5';
                break;

              case 4:
                classes = 'tag-size-4';
                break;

              case 3:
                classes = 'tag-size-3';
                break;

              case 2:
                classes = 'tag-size-2';
                break;

              case 1:
                classes = 'tag-size-1';
                break;

              default:
                classes = 'tag-size-0';
                break;
            }

            return (
              <a
                key={d.id}
                href="#tag"
                className={classes}
                data-name={d.name}
                onClick={this.handleClickTag}
              >
                {`#${d.name} (${d.count})`}
              </a>
            );
          })}
        </div>
      </div>
    );

    output.categories = (
      <li className="app__toolbar__categories">
        <ComboBox
          valueField="name"
          textField={d => (typeof d === 'string' ? d : `${d.name}${d.count ? ` (${d.count})` : ''}`)}
          suggest={true}
          data={categoriesMenu}
          value={category}
          onChange={this.handleSelectCategory}
        />
      </li>
    );

    output.inputIcon = <i className="i-search" />;
    if (filter.search) {
      output.inputIcon = (
        <a href="#clean" onClick={this.handleSearch}>
          <i className="i-remove" />
        </a>
      );
    }

    return (
      <div className="app__toolbar">
        <div className="app__container">
          <div className="app__toolbar__heading">
            <h1>{logos.data.length > 0 && (<span>{logos.data.length}</span>)}High-quality SVG logos</h1>
          </div>
          <div className="app__toolbar__search">
            <input
              type="text"
              name="search"
              value={search}
              placeholder="Search logos"
              onChange={this.handleSearch}
            />
            <span className="input-icon">{output.inputIcon}</span>
          </div>
          <div className="app__toolbar__views">
            <span>
              Sort by
              <a
                href="#latest"
                className={cx({ active: filter.view === 'latest' })}
                data-value="latest"
                onClick={this.handleClickChangeView}
              >
                date
              </a>,
              <a
                href="#name"
                className={cx({ active: filter.view === 'all' })}
                data-value="all"
                onClick={this.handleClickChangeView}
              >
                name
              </a>
            </span>
            <span>
            Filter by
              <a
                href="#name"
                className={cx({ active: filter.view === 'favorites' })}
                data-value="favorites"
                onClick={this.handleClickChangeView}
              >
                favorites
              </a>,
              <a
                href="#name"
                className={cx({ active: filter.view === 'vectorized' })}
                data-value="vectorized"
                onClick={this.handleClickChangeView}
              >
                vectorized
              </a>
            </span>
          </div>
          <ul className="app__toolbar__menu">
            {output.categories}
            {output.tagsMenu}
            <li className="app__toolbar__columns">
              <div className="app__toolbar__switch">
                <a
                  href="#switch-down"
                  className={cx({ disabled: filter.columns < 2 })}
                  data-column="-1"
                  onClick={this.handleClickColumns}
                >
                  <i className="i-minus" />
                </a>
                <a
                  href="#switch-down"
                  className={cx({ disabled: filter.columns > (window.innerWidth > 880 ? 4 : 2) })}
                  data-column="1"
                  onClick={this.handleClickColumns}
                >
                  <i className="i-plus" />
                </a>
              </div>
            </li>
          </ul>
        </div>
        {output.tagCloud}
      </div>
    );
  }
}
