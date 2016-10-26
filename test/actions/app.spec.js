import { goTo, showAlert, hideAlert, login, logOut } from 'actions';

describe('App', () => {
  it('goTo should create an action to navigate with react-router', () => {
    expect([goTo('/destination')]).toMatchSnapshot();
  });

  it('showAlert should return an action', () => {
    expect(showAlert('success', 'Alright!', false)).toMatchSnapshot();
  });

  it('hideAlert should return an action', () => {
    expect(hideAlert()).toMatchSnapshot();
  });

  it('login should return an action', () => {
    expect(login()).toMatchSnapshot();
  });

  it('logOut should return an action', () => {
    expect(logOut()).toMatchSnapshot();
  });
});
