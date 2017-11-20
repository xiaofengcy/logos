import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'vendor/polyfills';
import NPMPackage from '../../package.json';

Enzyme.configure({ adapter: new Adapter() });

global.VERSION = NPMPackage.version;

Object.defineProperty(window.location, 'protocol', {
  writable: true,
  value: 'http:',
});

Object.defineProperty(window.location, 'host', {
  writable: true,
  value: 'localhost:3000',
});

Object.defineProperty(window.location, 'pathname', {
  writable: true,
  value: '/',
});

Object.defineProperty(window.location, 'href', {
  writable: true,
  value: 'http://localhost:3000/',
});

Object.defineProperty(window.location, 'search', {
  writable: true,
  value: '',
});

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: '',
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

Object.defineProperty(window, 'open', {
  writable: true,
  value: '',
});

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

const consoleWarn = console.warn;
console.warn = jest.fn(message => {
  const skipMessages = [
    'Accessing PropTypes via the main React package is deprecated',
    'Accessing createClass via the main React package is deprecated',
    'isMounted is deprecated',
    'Accessing factories like React.DOM',
    'ReactTestUtils has been moved',
  ];
  let shouldSkip = false;

  for (const s of skipMessages) {
    if (message.includes(s)) {
      shouldSkip = true;
    }
  }

  if (!shouldSkip) {
    consoleWarn(message);
  }
});

const consoleError = console.error;
console.error = jest.fn(message => {
  const skipMessages = [
    'Accessing PropTypes via the main React package is deprecated',
    'Accessing createClass via the main React package is deprecated',
    'Shallow renderer has been moved',
    'isMounted is deprecated',
    'ReactTestUtils has been moved to react-dom/test-utils',
  ];
  let shouldSkip = false;

  for (const s of skipMessages) {
    if (message.includes(s)) {
      shouldSkip = true;
    }
  }

  if (!shouldSkip) {
    consoleError(message);
  }
});

window.matchMedia = () =>
  ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    },
  });
