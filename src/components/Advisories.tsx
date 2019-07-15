import * as React from 'react';
import { Text, View, Linking, TouchableOpacity } from 'react-native';

import styles from './Advisories.styles';
import tracker from '../native/analytics';
import { Advisory } from '../reducers/appStore';

type Props = {
  advisories?: Advisory[];
};

export default class StationView extends React.Component<Props> {
  goToAdvisories = () => {
    tracker.logEvent('go_to_advisories');
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
          <Text style={styles.icon}>⚠️</Text>
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
