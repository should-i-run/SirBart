import FB from 'react-native-firebase';

// https://rnfirebase.io/docs/v5.x.x/analytics/reference/analytics

const wrapper = {
  logEvent: (name: string, args: any = {}) => {
    if (!__DEV__) {
      FB.analytics().logEvent(name, args);
    }
  },
};

export default wrapper;
