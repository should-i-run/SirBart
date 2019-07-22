import * as React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';

import styles from './LocationError.styles';
import tracker from '../native/analytics';
import { LocationErrorReason } from '../actions/locationActions';

type Props = {
  errorReason: LocationErrorReason;
};

export default class LocationError extends React.Component<Props> {
  goToSettings = () => {
    tracker.logEvent('go_to_settings');
    // Linking.openURL('(UIApplication.openSettingsURLString)&path=LOCATION/(bundleId)');
    Linking.openURL('App-Prefs:path=com.hr.Should-I-Run');
    // Linking.openURL('App-Prefs:root=LOCATION_SERVICES');
    // Linking.openURL('App-Prefs:root=Privacy&path=LOCATION/com.hr.Should-I-Run');
    // Linking.openURL('App-Prefs:root=Privacy&path=com.hr.Should-I-Run');
    // Linking.openURL('app-settings://location/com.hr.Should-I-Run');
  };

  render() {
    const { errorReason } = this.props;
    if (errorReason === 'PERMISSION_DENIED') {
      return (
        <View style={styles.container}>
          <Text style={[styles.genericText, { fontSize: 26 }]}>
            😩 No Location
          </Text>
          <TouchableOpacity onPress={this.goToSettings}>
            <Text style={[styles.text]}>
              We can't get you to BART without your location!
            </Text>
            <Text style={[styles.text]}>
              Tap here and go to Privacy > Location Services > BART Check to
              enable access.
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (errorReason === 'OUTSIDE_RANGE') {
      return (
        <View style={styles.container}>
          <Text style={[styles.genericText, { fontSize: 26 }]}>
            😩 Out of Range
          </Text>
          <Text style={[styles.text]}>
            Looks like you're outside the BART coverage area.
          </Text>
          <Text style={[styles.text]}>
            This app is only useful in the San Francisco Bay Area. Come join us
            to get in on the public transit fun.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={[styles.genericText, { fontSize: 26 }]}>😩 Oh No!</Text>
        <Text style={[styles.text]}>
          Looks like there was a problem getting your location. Please wait a
          few moments and try again.
        </Text>
      </View>
    );
  }
}
