import React from 'react';
import { shallow } from 'enzyme';

import { CMS } from 'containers/CMS';
import { firebaseState } from 'reducers/firebase';
import fetchMock from 'fetch-mock';

function setup() {
  const props = {
    app: {
      isMobile: false,
    },
    firebase: firebaseState,
    dispatch: () => {},
    location: {},
    user: {
      isAdmin: true,
    },
  };

  return shallow(
    <CMS {...props} />,
    { attachTo: document.getElementById('react') },
  );
}

describe('CMS', () => {
  let wrapper;

  beforeAll(() => {
    fetchMock.mock('http://example.com/token', 404, {
      error: 'FAILED',
      headers: { 'Content-Type': 'application/json' },
    });
    wrapper = setup(true);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.find('.app__header__logo')).toBePresent();
    expect(wrapper.find('Logo')).toBePresent();
    expect(wrapper.find('Loader')).toBePresent();
    expect(wrapper.find('Portal')).toBePresent();
  });
});
