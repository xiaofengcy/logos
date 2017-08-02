import { ActionTypes, XHR } from 'constants/index';

jest.mock('expose?$!expose?jQuery!jquery', () => {});
jest.mock('bootstrap/js/dist/modal', () => {});
jest.mock('footable/compiled/footable', () => {});

require('index.jsx');

describe('Constants:ActionTypes', () => {
  it('should match the snapshot', () => {
    expect(ActionTypes).toMatchSnapshot();
  });
});


describe('Constants:XHR', () => {
  it('should match the snapshot', () => {
    expect(XHR).toMatchSnapshot();
  });
});
