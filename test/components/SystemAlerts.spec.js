import React from 'react';
import { mount } from 'enzyme';

import SystemAlerts from 'components/SystemAlerts';

jest.useFakeTimers();

const mockDispatch = jest.fn();

function setup() {
  const props = {
    alerts: [],
    dispatch: mockDispatch,
  };

  return mount(<SystemAlerts {...props} />);
}

describe('SystemAlerts', () => {
  const wrapper = setup();

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.find('.app__system-alerts').length).toBe(1);
  });

  it('should handle `top` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD10',
          message: 'Hello World',
          position: 'top',
          status: 'success',
          timeout: 5,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__top').length).toBe(1);
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD10' },
    });
  });

  it('should handle `top-left` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD11',
          message: 'Hello World',
          position: 'top-left',
          status: 'error',
          timeout: 5,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__top-left').length).toBe(1);
    expect(mockDispatch.mock.calls[1][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD11' },
    });
  });

  it('should handle `top-right` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD12',
          message: 'Hello World',
          position: 'top-right',
          status: 'info',
          timeout: 5,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__top-right').length).toBe(1);
    expect(mockDispatch.mock.calls[2][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD12' },
    });
  });

  it('should handle `bottom` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD13',
          message: 'Hello World',
          position: 'bottom',
          status: 'help',
          timeout: 5,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__bottom').length).toBe(1);
    expect(mockDispatch.mock.calls[3][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD13' },
    });
  });

  it('should handle `bottom-left` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD14',
          message: 'Hello World',
          position: 'bottom-left',
          status: 'warning',
          timeout: 5,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__bottom-left').length).toBe(1);
    expect(mockDispatch.mock.calls[4][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD14' },
    });
  });

  it('should handle `bottom-right` alerts', () => {
    wrapper.setProps({
      alerts: [
        {
          id: 'ABD15',
          message: 'Hello World',
          position: 'bottom-right',
          status: '',
          timeout: 0,
        },
      ],
    });

    jest.runOnlyPendingTimers();

    expect(wrapper.find('.app__system-alerts__bottom-right').length).toBe(1);
    expect(mockDispatch.mock.calls.length).toBe(5);
  });

  it('should handle click to close', () => {
    wrapper.find('.app__alert__close').simulate('click');

    expect(mockDispatch.mock.calls[5][0]).toEqual({
      type: 'HIDE_ALERT',
      payload: { id: 'ABD15' },
    });
  });

  it('should be able to unmount the component', () => {
    wrapper.unmount();
    expect(wrapper.find('.app__system-alerts').length).toBe(0);
  });
});