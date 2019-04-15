import * as React from 'react';
import { Text, Linking, TouchableOpacity } from 'react-native';
import tracker from '../native/analytics';
import styles from './LocationError.styles';

function goToSettings() {
  tracker.logEvent('go_to_privacy_policy');
  Linking.openURL('TODO PP url');
}

export default function PrivacyPolicy() {
  return (
    <TouchableOpacity onPress={goToSettings}>
      <Text style={[styles.text]}>Privacy Policy</Text>
    </TouchableOpacity>
  );
}
