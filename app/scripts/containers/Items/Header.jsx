import React from 'react';

import Toolbar from './Toolbar';

const ItemsHeader = ({ app, dispatch, firebase, handleClickTag, handleChangeColumns }) => {
  let toolbar;

  if (firebase.ready) {
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
      <h1><span>{firebase.logos.data.length}</span>High-quality SVG logos</h1>
      {toolbar}
    </div>
  );
};

ItemsHeader.propTypes = {
  app: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  firebase: React.PropTypes.object.isRequired,
  handleChangeColumns: React.PropTypes.func.isRequired,
  handleClickTag: React.PropTypes.func.isRequired,
};

export default ItemsHeader;
