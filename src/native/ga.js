import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker('UA-54111913-2');

const trackerStub = {
  trackEvent: () => {},
  trackScreenView: () => {},
};

export default __DEV__ ? trackerStub : tracker;
