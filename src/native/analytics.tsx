import Analytics from 'appcenter-analytics';

// https://docs.microsoft.com/en-us/appcenter/sdk/analytics/react-native

const wrapper = {
  logEvent: (name: string, otherArgs?: { [k: string]: string }) => {
    if (!__DEV__) {
      Analytics.trackEvent(name, otherArgs);
    }
  },
};

export default wrapper;
