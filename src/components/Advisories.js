/* @flow */
import React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './Advisories.styles';
import tracker from '../native/ga';

type Advisory = {
  '@id': string,
  station: string,
  type: string,
  description: {
    '#cdata-section': string,
  },
  expires: string,
};

type Props = {
  advisories: ?(Advisory[]),
};

export default class StationView extends React.Component {
  props: Props;

  goToAdvisories = () => {
    tracker.trackEvent('interaction', 'go-to-advisories');
    Linking.openURL('http://m.bart.gov/schedules/advisories');
  };

  render() {
    const { advisories } = this.props;
    if (!advisories) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.container} onPress={this.goToAdvisories}>
        {advisories.map(adv => (
          <View style={styles.advisory} key={adv['@id']}>
            <Text style={styles.text}>
              {adv.description['#cdata-section'].replace(' Visit bart.gov.', '')}
            </Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  }
}
