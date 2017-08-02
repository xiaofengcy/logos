import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'containers/App';

const props = {
  app: {
    alerts: [],
    rehydrated: false,
  },
  dispatch: () => {},
  firebase: {
    isReady: false,
  },
  user: {
    isAuthenticated: false,
  },
};

function setup(ownProps = props) {
  return shallow(
    <App {...ownProps} />,
    { lifecycleExperimental: true }
  );
}

describe('App', () => {
  const wrapper = setup();
  const instance = wrapper.instance();

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render a Loader', () => {
    expect(wrapper.find('Loader').length).toBe(1);
  });

  it('should render some the UI', () => {
    wrapper.setProps({
      app: {
        ...instance.props.app,
        rehydrated: true,
      },
    });

    expect(wrapper.find('ConnectedRouter').length).toBe(1);
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('main').length).toBe(1);
    expect(wrapper.find('Footer').length).toBe(1);
    expect(wrapper.find('SystemAlerts').length).toBe(1);
  });
});
