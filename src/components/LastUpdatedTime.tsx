import { connect } from 'react-redux';
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { State as ReducerState, NetworkStatus } from '../reducers/appStore';
import { colors, genericText } from '../styles';
import { StyleSheet } from 'react-native';
import { differenceSeconds } from '../utils/time';

const styles = StyleSheet.create({
  alighRight: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  darkText: {
    ...genericText,
    color: colors.lightText,
    fontSize: 14,
    textAlign: 'right',
    marginRight: 10,
  },
});

type Props = {
  time?: Date;
  network: Record<string, NetworkStatus>;
};

type State = {
  timeDifferenceString?: string;
};

class LastUpdatedTime extends React.Component<Props, State> {
  state = {
    timeDifferenceString: undefined,
  };

  componentDidMount() {
    setInterval(() => {
      const { time } = this.props;
      this.setState({
        timeDifferenceString:
          time && differenceSeconds(time, new Date()).toString(),
      });
    }, 1000);
  }

  render() {
    const { network } = this.props;
    const isFetching = Object.values(network).some(
      n => n === NetworkStatus.Fetching,
    );

    const { timeDifferenceString } = this.state;
    if (!timeDifferenceString) return null;
    return (
      <View style={styles.alighRight}>
        {isFetching && <ActivityIndicator style={{ marginRight: 10 }} />}

        <Text style={styles.darkText}>
          updated {this.state.timeDifferenceString} seconds ago
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state: ReducerState) => ({
  network: state.network,
  time: state.timesLastUpdatedAt,
});

export default connect(mapStateToProps)(LastUpdatedTime);
