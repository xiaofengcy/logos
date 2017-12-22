import React from 'react';
import { shallow } from 'enzyme';

import { Home } from 'containers/Home';

import { appState } from 'reducers/app';
import { firebaseState } from 'reducers/firebase';

const mockDispatch = jest.fn();

function setup() {
  const props = {
    app: appState,
    dispatch: mockDispatch,
    firebase: { ...firebaseState },
    location: {},
  };

  return shallow(<Home {...props} />);
}

describe('Home', () => {
  const wrapper = setup(true);

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.find('.app__home').length).toBe(1);
  });

  it('should render images', () => {
    wrapper.setProps({
      firebase: { ...firebaseState, isReady: true },
    });

    expect(wrapper.find('.app__images').length).toBe(1);
    expect(wrapper.find('.app__home__heading').length).toBe(1);
  });
});
