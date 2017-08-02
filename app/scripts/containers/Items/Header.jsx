import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from './Toolbar';

const ItemsHeader = ({ app, dispatch, firebase, handleClickTag, handleChangeColumns }) => {
  let toolbar;

  if (firebase.isReady) {
    toolbar = (
      <Toolbar
        app={app}
        firebase={firebase}
        dispatch={dispatch}
        handleClickTag={handleClickTag}
        handleChangeColumns={handleChangeColumns}
      />);
  }

  return (
    <div className="app__items__header">
      <h1>{firebase.logos.data.length > 0 && (<span>{firebase.logos.data.length}</span>)}High-quality SVG logos</h1>
      {toolbar}
    </div>
  );
};

ItemsHeader.propTypes = {
  app: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  firebase: PropTypes.object.isRequired,
  handleChangeColumns: PropTypes.func.isRequired,
  handleClickTag: PropTypes.func.isRequired,
};

export default ItemsHeader;
