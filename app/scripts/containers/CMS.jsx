import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Debounce } from 'lodash-decorators';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';

import config from 'config';
import { goTo, logOut, updateTaxonomies } from 'actions';

import Logo from 'components/Logo';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import FormItem from 'components/FormItem';

export class CMS extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      item: undefined,
      showModal: false,
    };

    this.initialValues = {
      categories: [],
      tags: [],
      files: [],
      favorite: false,
      public: false,
      edited: false,
      vectorized: false,
      updated: null,
    };

    this.columns = [
      {
        name: 'image',
        title: 'Imagem',
        breakpoints: 'xs sm',
        sortable: false,
      },
      {
        name: 'name',
        title: 'Name',
        breakpoints: 'xs sm',
        type: 'html',
        sortable: false,
        filterable: false,
      },
      {
        name: 'files',
        title: 'Imagem',
        breakpoints: 'xs sm',
        sortable: false,
      },
      {
        name: 'metadata',
        title: 'Metadata',
        breakpoints: 'xs sm',
        sortable: false,
      },
      {
        name: 'date',
        title: 'Date',
        breakpoints: 'xs sm',
        type: 'date',
        'format-string': 'YYYY-MM-DD',
        filterable: false,
        sorted: true,
        direction: 'DESC',
      },
    ];
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (this.props.firebase.isReady) {
      this.setProperties();
      this.initTable();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { firebase } = this.props;

    if (!firebase.isReady && nextProps.firebase.isReady) {
      this.setProperties();
    }
  }

  componentDidUpdate(prevProps) {
    const { firebase: prevFirebase } = prevProps;
    const { firebase } = this.props;

    if (
      (!prevFirebase.isReady && firebase.isReady)
      || (prevFirebase.logos.updated !== firebase.logos.updated)
      || (prevFirebase.categories.updated !== firebase.categories.updated)
      || (prevFirebase.tags.updated !== firebase.tags.updated)
    ) {
      this.initTable();
    }
  }

  handleClickLogo = (e) => {
    e.preventDefault();
    this.props.dispatch(goTo('/'));
  };

  handleClickLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(logOut());
  };

  handleClickNew = (e) => {
    e.preventDefault();

    this.setState({
      item: this.initialValues,
      showModal: true,
    });
  };

  handleClickEdit = (e) => {
    e.preventDefault();
    const data = e.currentTarget.dataset;
    const item = this.props.firebase.logos.data.find(d => d.id === data.id);

    this.setState({
      item,
      showModal: true,
    });
  };

  handleClickUpdate = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(updateTaxonomies());
  };

  handleHideModal = () => {
    this.setState({
      item: undefined,
      showModal: false,
    });
  };

  handleClickFilter = (e) => {
    e.preventDefault();
    const data = e.currentTarget.dataset;

    this.filtering = FooTable.get(this.table).use(FooTable.Filtering);
    this.filtering.addFilter('search', `"${data.name}"`);
    this.filtering.filter();
  };

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

  @Debounce(500)
  initTable() {
    if (this.table) {
      const { categories: { data: categories } } = this.props.firebase;
      const $table = $(this.table);

      FooTable.Categories = FooTable.Filtering.extend({
        construct(instance) {
          this._super(instance);
          this.categories = categories;
          this.def = 'Categories';
          this.$category = null;
        },
        $create() {
          this._super();
          const self = this;
          const $form_grp = $('<div/>').addClass('form-group')
            .append($('<label/>').addClass('sr-only'))
            .prependTo(self.$form);

          self.$category = $('<select/>').addClass('form-control')
            .on('change', { self }, self._onStatusDropdownChanged)
            .append($('<option/>', { text: self.def }))
            .appendTo($form_grp);

          $.each(categories, (i, c) => {
            self.$category.append($(`<option value="${c.name}"/>`).text(`${c.name} (${c.count})`));
          });
        },
        _onStatusDropdownChanged(e) {
          const { self } = e.data;
          const selected = $(this).val();
          if (selected !== self.def) {
            self.addFilter('categories', selected);
          } else {
            self.removeFilter('categories');
          }
          self.filter();
        },
        draw() {
          this._super();
          const category = this.find('categories');
          if (category instanceof FooTable.Filter) {
            this.$category.val(category.query.val());
          } else {
            this.$category.val(this.def);
          }
        },
      });

      $table.footable({
        breakpoints: {
          xs: 120,
          sm: 400,
          md: 768,
          lg: 1024,
        },
        components: {
          filtering: FooTable.Categories,
        },
        filtering: {
          enabled: true,
          min: 2,
          space: 'OR',
        },
        paging: {
          enabled: true,
          limit: window.innerWidth < 400 ? 3 : 5,
          position: 'center',
          size: 50,
        },
        sorting: {
          enabled: true,
        },
        getWidth: () => window.innerWidth,
      });
    }
  }

  renderTable() {
    const { logos } = this.props.firebase;

    return (
      <table key={logos.updated} ref={c => (this.table = c)} className="table">
        <thead>
          <tr>
            <th data-type="html" data-sortable="false">Image</th>
            <th data-type="html">Name</th>
            <th
              data-type="html"
              data-sortable="false"
              data-filterable="false"
              data-breakpoints="xs sm"
            >
              Files
            </th>
            <th data-type="html" data-sortable="false" data-breakpoints="xs sm">Metadata</th>
            <th
              data-breakpoints="xs"
              data-type="date"
              data-format-string="YYYY-MM-DD"
              data-filterable="false"
              data-sorted="true"
              data-direction="DESC"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {logos.data.map(d => (
            <tr key={d.id}>
              <td>
                <div className="app__cms__img">
                  <a href={d.url} target="_blank">
                    <img
                      src={`${config.cdnURL}${encodeURIComponent(d.files[0])}`}
                      alt={d.shortname}
                    />
                  </a>
                </div>
              </td>
              <td data-filter-value={d.shortname} data-sort-value={d.shortname}>
                <h4><a href={d.url} target="_blank">{d.name}</a></h4>
                <a href="#edit" onClick={this.handleClickEdit} data-id={d.id}>edit</a>
              </td>
              <td>
                <div className="app__cms__files">
                  {d.files.map(f => (
                    <a key={f} href={`${config.cdnURL}${encodeURIComponent(f)}`} target="_blank">{f}</a>))}
                </div>
              </td>
              <td>
                <div className="app__cms__categories">
                  {d.categories.map(c => (
                    <a
                      href="#filter"
                      key={c} data-name={c}
                      onClick={this.handleClickFilter}
                    >
                      {`${c} (${this.categories[c]})`}
                    </a>
                  ))}
                </div>
                <div className="app__cms__tags">
                  {d.tags.map(t => (
                    <a href="#filter" key={t} data-name={t} onClick={this.handleClickFilter}>
                      {`${t} (${this.tags[t]})`}
                    </a>
                  ))}
                </div>
              </td>
              <td>{d.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { item, showModal } = this.state;
    const { app: { isMobile }, firebase, user } = this.props;
    const output = {
      table: (<Loader />),
    };
    let tags = [];
    let categories = [];

    if (firebase.isReady) {
      output.toolbar = (
        <div className="app__cms__toolbar">
          <a
            href="#create"
            className="btn btn-lg btn-primary btn-icon"
            onClick={this.handleClickNew}
          >
            <i className="i-plus" />
            <span>NEW</span>
          </a>
          <a
            href="#update"
            className="btn btn-lg btn-primary btn-icon"
            onClick={this.handleClickUpdate}
          >
            <i className="i-recycle" />
            <span>UPDATE</span>
          </a>
        </div>
      );

      output.table = this.renderTable();
      tags = _map(firebase.tags.data, d => d.name);
      categories = _map(firebase.categories.data, d => d.name);
    }

    if (showModal) {
      output.form = (
        <FormItem
          item={item}
          categories={categories}
          tags={tags}
          hideModal={this.handleHideModal}
        />
      );
    }

    if (!user.isAdmin) {
      return (
        <div key="CMS" className="app__cms app__route">
          <div className="app__container">Invalid Credentials</div>
        </div>
      );
    }

    return (
      <div key="CMS" className="app__cms app__route">
        <header className="app__header">
          <div className="app__container">
            <a href="#home" className="app__header__logo" onClick={this.handleClickLogo}><Logo icon={isMobile} /></a>
            <div className="app__header__menu">
              <ul className="list-unstyled">
                <li>
                  <a href="#logout" className="app__logout" onClick={this.handleClickLogout}>
                    <span>logout</span><i className="i-sign-out" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className="app__container">
          {output.toolbar}
          {output.table}
          <Modal show={showModal} onHide={this.handleHideModal}>
            {output.form}
          </Modal>
        </div>
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

export default connect(mapStateToProps)(CMS);
