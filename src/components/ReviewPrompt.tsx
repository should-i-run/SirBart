import * as React from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { getLaunchCount } from '../utils/launches';
import tracker from '../native/analytics';
import * as StoreReview from 'react-native-store-review';

const HAS_REVIEWED_KEY = 'has_reviewed';

function handleRate() {
  AsyncStorage.setItem(HAS_REVIEWED_KEY, 'true');
  tracker.logEvent('rate_yes');
  StoreReview.requestReview();
}

function handleCancel() {
  tracker.logEvent('rate_no');
}

export default class ReviewPrompt extends React.Component {
  async componentDidMount() {
    if (!StoreReview.isAvailable) {
      console.log('store review not avail');
      return;
    }
    const launchCount = await getLaunchCount();
    console.log({ launchCount });
    const hasReviewed = AsyncStorage.getItem(HAS_REVIEWED_KEY);
    const shouldPrompt =
      launchCount === 5 || launchCount === 20 || launchCount === 50 || launchCount === 100;
    if (shouldPrompt && !hasReviewed) {
      setTimeout(() => {
        tracker.logEvent('rate_prompted');
        Alert.alert(
          'Rate BART Check',
          'If you love BART Check, please take a moment to rate it in the App Store',
          [
            { text: 'Not Now', style: 'cancel', onPress: handleCancel },
            { text: 'Rate', style: 'default', onPress: handleRate },
          ],
        );
      }, 1000 * 30);
    }
  }

  render() {
    return null;
  }
}
