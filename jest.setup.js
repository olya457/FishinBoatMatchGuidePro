jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens');

  return {
    ...actual,
    enableScreens: jest.fn(),
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MapView = props => React.createElement(View, props, props.children);
  const Marker = props => React.createElement(View, props, props.children);

  return {
    __esModule: true,
    default: MapView,
    Marker,
  };
});
