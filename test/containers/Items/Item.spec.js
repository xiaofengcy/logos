import React from 'react';
import { mount } from 'enzyme';

import Item from 'containers/Items/Item';

const mockHandleClickTag = jest.fn();

function setup() {
  const props = {
    data: {
      name: 'React',
      files: [
        'react.svg',
      ],
      shortname: 'react',
      url: 'https://facebook.github.io/react/',
      tags: [
        'front-end framework',
        'javascript',
        'facebook',
      ],
      categories: [
        'developers',
      ],
      updated: '2015-06-11',
    },
    index: 0,
    handleClickTag: mockHandleClickTag,
  };

  return mount(<Item {...props} />);
}

describe('Item', () => {
  const wrapper = setup();

  it('should be a StatelessComponent', () => {
    expect(wrapper.instance()).toBeNull();
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

