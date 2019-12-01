import { TextStyle } from 'react-native';

export const colors = {
  layer0: '#000',
  layer1: '#10131a',
  layer2: '#181D28',
  layer3: '#262D3F',
  shadow: '#000',
  // button: '#056c65', // green
  // button: '#5badd3', // light blue
  // button: '#607d8b', // grey blue
  // button: '#03a9f4', // another light blue
  // button: '#7986cb', // <- yes
  button: '#5c6bc0',
  disabledText: '#888',
  walk: '#6FD57F',
  run: '#FC5B3F',
  lightText: '#AAA',
  genericText: '#E6E6E6',
  icon: '#C4C4C4',
};

export const genericText: TextStyle = {
  color: colors.genericText,
  fontSize: 18,
  fontWeight: '200',
};
