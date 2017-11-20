import React from 'react';
import { shallow } from 'enzyme';

import ItemsHeader from 'containers/Items/Header';

const mockDispatch = jest.fn();
const mockHandleChangeColumns = jest.fn();
const mockHandleClickTag = jest.fn();

function setup() {
  const props = {
    app: {},
    dispatch: mockDispatch,
    firebase: {
      logos: {
        data: [],
      },
      isReady: true,
    },
    handleChangeColumns: mockHandleChangeColumns,
    handleClickTag: mockHandleClickTag,
  };

  return shallow(<ItemsHeader {...props} />);
}

describe('ItemsHeader', () => {
  const wrapper = setup();

  it('should be a StatelessComponent', () => {
    expect(wrapper.instance()).toBeNull();
  });

  it('should render properly', () => {
    expect(wrapper.find('.app__items__header').length).toBe(1);
    expect(wrapper.find('Toolbar').length).toBe(1);
  });
});

