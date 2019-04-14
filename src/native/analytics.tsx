import Analytics from 'appcenter-analytics';

// https://docs.microsoft.com/en-us/appcenter/sdk/analytics/react-native

const wrapper = {
  logEvent: (name: string) => {
    // if (!__DEV__) {
    Analytics.trackEvent(name);
    // Analytics.trackEvent('Video clicked', { Category: 'Music', FileName: 'favorite.avi' });
    // }
  },
};

export default wrapper;
