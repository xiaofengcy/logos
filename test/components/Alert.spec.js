import React from 'react';
import { mount } from 'enzyme';

import Alert from 'components/Alert';

function setup(children = 'Hello World', type = '') {
  return mount(<Alert type={type}>{children}</Alert>);
}

describe('Alert', () => {
  let wrapper = setup();

  it('should be a StatelessComponent', () => {
    expect(wrapper.instance()).toBeNull();
  });

  it('should render properly', () => {
    expect(wrapper.find('.app__alert').length).toBe(1);
    expect(wrapper.find('.app__alert__icon').length).toBe(1);
    expect(wrapper.find('.app__alert__content').length).toBe(1);
  });

  it('should render a default alert', () => {
    expect(wrapper.find('.app__alert__content').text()).toBe('Hello World');
  });

  it('should render a success alert', () => {
    wrapper = setup('This is a success message', 'success');

    expect(wrapper.find('.app__alert__content').text()).toBe('This is a success message');
    expect(wrapper.find('.app__alert').hasClass('is-success')).toBe(true);
  });

  it('should render a error alert with markup', () => {
    wrapper = setup(<p>This is a success message</p>, 'error');

    expect(wrapper.find('.app__alert__content p').length).toBe(1);
    expect(wrapper.find('.app__alert').hasClass('is-error')).toBe(true);
  });

  it('should render a warning alert', () => {
    wrapper = setup('This is a warning message', 'warning');

    expect(wrapper.find('.app__alert__content').text()).toBe('This is a warning message');
    expect(wrapper.find('.app__alert').hasClass('is-warning')).toBe(true);
  });

  it('should render a info alert', () => {
    wrapper = setup('This is a info message', 'info');

    expect(wrapper.find('.app__alert__content').text()).toBe('This is a info message');
    expect(wrapper.find('.app__alert').hasClass('is-info')).toBe(true);
  });

  it('should render a black alert with markup', () => {
    wrapper = setup(<div>This is a black message</div>, 'black');

    expect(wrapper.find('.app__alert__content div').length).toBe(2);
    expect(wrapper.find('.app__alert').hasClass('is-black')).toBe(true);
  });
});
