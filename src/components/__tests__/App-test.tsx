import 'react-native';
import React from 'react';

import App from '../App';

import ShallowRenderer from 'react-test-renderer/shallow';

it('renders correctly', () => {
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<App />);

  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
