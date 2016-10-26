import React from 'react';
import { mount } from 'enzyme';

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

  return mount(<Toolbar {...props} />);
}

describe('Toolbar', () => {
  const wrapper = setup();

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

