import { connect } from 'react-redux';
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { State as ReducerState, NetworkStatus } from '../reducers/appStore';
import { colors, genericText } from '../styles';
import { StyleSheet } from 'react-native';
import { differenceSeconds } from '../utils/time';
import { URL as stationsURL } from '../actions/dataActions';

const styles = StyleSheet.create({
  alignRight: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  darkText: {
    ...genericText,
    color: colors.lightText,
    fontSize: 14,
    textAlign: 'right',
  },
});

type Props = {
  time?: Date;
  network: Record<string, NetworkStatus>;
  manualRefreshing: boolean;
};

type State = {
  timeDifference: number;
};

class LastUpdatedTime extends React.Component<Props, State> {
  state = {
    timeDifference: 0,
  };

  componentDidMount() {
    setInterval(() => {
      const { time } = this.props;
      this.setState({
        timeDifference: time ? differenceSeconds(time, new Date()) : 0,
      });
    }, 200);
  }

  render() {
    const { network, manualRefreshing } = this.props;
    const isFetching = Object.keys(network).some(
      k => network[k] === NetworkStatus.Fetching && k === stationsURL,
    );

    const { timeDifference } = this.state;
    return (
      <View
        style={[
          styles.alignRight,
          {
            height: 18,
            marginBottom: 4,
            marginRight: 10,
          },
        ]}
      >
        {isFetching && !manualRefreshing && (
          <ActivityIndicator style={{ marginRight: 10 }} />
        )}
        {timeDifference !== undefined && (
          <View style={styles.alignRight}>
            <Text style={[styles.darkText, { marginRight: 4 }]}>Updated</Text>
            {/*
            // @ts-ignore Bad Defs */}
            <Text style={[styles.darkText, { fontVariant: ['tabular-nums'] }]}>
              {timeDifference}
            </Text>
            <Text style={styles.darkText}>s ago</Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: ReducerState) => ({
  network: state.network,
  time: state.timesLastUpdatedAt,
});

export default connect(mapStateToProps)(LastUpdatedTime);
