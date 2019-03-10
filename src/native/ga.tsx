// import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
import FB from 'react-native-firebase';

const FBAnalytics = FB.analytics();

// const tracker = new GoogleAnalyticsTracker('UA-54111913-2');

const wrapper = {
  logEvent: (name: string, args: any = {}) => {
    if (!__DEV__) {
      FBAnalytics.logEvent(name, args);
    }
  },
};

export default wrapper;
// export default trackerStub;
