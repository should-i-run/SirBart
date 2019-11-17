import Analytics from 'appcenter-analytics';
import { log } from '../utils/sumo';

// https://docs.microsoft.com/en-us/appcenter/sdk/analytics/react-native

const wrapper = {
  logEvent: (name: string, otherArgs?: { [k: string]: string }) => {
    log(name);
    if (!__DEV__) {
      Analytics.trackEvent(name, otherArgs);
    }
  },
};

export default wrapper;
