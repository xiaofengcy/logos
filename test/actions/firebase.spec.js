import { initFirebase, connectLogos, connectCategories, connectTags, updateLogos } from 'actions';

jest.mock('utils/helpers', () => {
  const utils = require.requireActual('utils/helpers');
  return {
    ...utils,
    getUnixtime: () => 123456789,
  };
});

describe('Firebase', () => {
  it('initFirebase should return an action to connect to firebase', () => {
    expect(initFirebase()).toMatchSnapshot();
  });

  it('connectLogos should return an action to connect logos to the store', () => {
    expect(connectLogos).toMatchSnapshot();
  });

  it('connectCategories should return an action to connect categories to the store', () => {
    expect(connectCategories()).toMatchSnapshot();
  });

  it('connectTags should return an action to connect tags to the store', () => {
    expect(connectTags()).toMatchSnapshot();
  });

  it('updateLogos should return an action to update logos to the store', () => {
    expect(updateLogos()).toMatchSnapshot();
  });
});
