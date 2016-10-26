import React from 'react';
import { shallow } from 'enzyme';

import ItemsHeader from 'containers/Items/Header';
import Toolbar from 'containers/Items/Toolbar';
import { appState } from 'reducers/app';
import { firebaseState } from 'reducers/firebase';

const mockDispatch = jest.fn();
const mockHandleChangeColumns = jest.fn();
const mockHandleClickTag = jest.fn();

function setup() {
  const props = {
    app: appState,
    dispatch: mockDispatch,
    firebase: firebaseState,
    handleChangeColumns: mockHandleChangeColumns,
    handleClickTag: mockHandleClickTag,
  };

  return shallow(<ItemsHeader {...props} />);
}

describe('ItemsHeader', () => {
  const wrapper = setup();

  it('should be a StatelessComponent', () => {
    expect(wrapper.instance().constructor.name).toBe('StatelessComponent');
  });

  it('should render properly', () => {
    wrapper.setProps({
      firebase: { ...firebaseState, ready: true },
    });

    expect(wrapper.find('.app__items__header').length).toBe(1);
    expect(wrapper.find(Toolbar).length).toBe(1);
  });
});

