import * as React from 'react';
import {
  Text,
  View,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import styles from './Advisories.styles';
import tracker from '../native/analytics';
import { Advisory } from '../reducers/appStore';
import { colors } from '../styles';

type Props = {
  advisories?: Advisory[];
};

type State = {
  expanded: boolean;
};

export default class StationView extends React.Component<Props, State> {
  state = {
    expanded: false,
  };

  goToAdvisories = () => {
    tracker.logEvent('go_to_advisories');
    Linking.openURL('http://m.bart.gov/schedules/advisories');
  };

  render() {
    const { advisories } = this.props;
    const { expanded } = this.state;
    if (
      !advisories ||
      advisories.some(
        a => a.description['#cdata-section'] === 'No delays reported.',
      )
    ) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.setState({ expanded: !expanded })}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={[styles.genericText, { fontSize: 20 }]}>
            BART Service Advisories
          </Text>
        </View>
        <View>
          {advisories.map(adv => (
            <View style={styles.advisory} key={adv['@id']}>
              <Text
                style={styles.text}
                numberOfLines={expanded ? undefined : 2}
                ellipsizeMode={'tail'}
              >
                {adv.description['#cdata-section'].replace(
                  ' Visit bart.gov.',
                  '',
                )}
              </Text>
            </View>
          ))}
          {expanded && (
            <TouchableOpacity
              style={styles.advisory}
              onPress={this.goToAdvisories}
            >
              <Text style={[styles.text, { color: colors.button }]}>
                Go to Service Advisories
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
