/* @flow */
import * as React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './Advisories.styles';
import tracker from '../native/ga';
import { Advisory } from '../reducers/appStore';

type Props = {
  advisories?: Advisory[],
};

export default class StationView extends React.Component<Props> {
  goToAdvisories = () => {
    tracker.trackEvent('interaction', 'go-to-advisories');
    Linking.openURL('http://m.bart.gov/schedules/advisories');
  };

  render() {
    const { advisories } = this.props;
    if (
      !advisories ||
      advisories.some(a => a.description['#cdata-section'] === 'No delays reported.')
    ) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.container} onPress={this.goToAdvisories}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="exclamation-triangle" size={25} color="#FC5B3F" style={styles.icon} />
          <Text style={[styles.genericText, { fontSize: 26 }]}>BART Service Advisories</Text>
        </View>
        <View>
          {advisories.map(adv => (
            <View style={styles.advisory} key={adv['@id']}>
              <Text style={styles.text}>
                {adv.description['#cdata-section'].replace(' Visit bart.gov.', '')}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }
}