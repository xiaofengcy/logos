import React from 'react';
import { shallow } from 'enzyme';
import Logo from 'components/Logo';

describe('Logo', () => {
  const wrapper = shallow(<Logo />);

  it('should be a StatelessComponent', () => {
    expect(wrapper.instance()).toBeNull();
  });

  it('should render properly', () => {
    const InlineSVG = wrapper.find('InlineSVG');

    expect(InlineSVG).toBePresent();
    expect(InlineSVG).toHaveClassName('app__logo__full');
  });
});
