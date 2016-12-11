import {
  AppRegistry,
} from 'react-native';

// Uncomment these lines and disable CORS using a chrome
// extension to see network requests in chrome devtools.
// delete GLOBAL.XMLHttpRequest;
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest;

import App from './src/components/App';

AppRegistry.registerComponent('SirBart', () => App);
