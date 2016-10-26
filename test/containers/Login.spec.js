import React from 'react';
import { mount } from 'enzyme';

import { Login } from 'containers/Login';

const mockDispatch = jest.fn();

function setup() {
  const props = {
    dispatch: mockDispatch,
    user: {
      authenticated: false,
      isAdmin: false,
    },
  };

  return mount(<Login {...props} />);
}

describe('Login', () => {
  const wrapper = setup(true);

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
