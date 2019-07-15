import { connect } from 'react-redux';
import * as React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { State as ReducerState, NetworkStatus } from '../reducers/appStore';
import { colors, genericText } from '../styles';

type Props = {
  network: Record<string, NetworkStatus>;
};

class DataContainer extends React.Component<Props> {
  state = {
    fakeRefreshing: false,
  };

  render() {
    const { network } = this.props;
    const isFetching = Object.values(network).some(n => n === NetworkStatus.Fetching);
    return (
      <View
        style={{
          height: 20,
          backgroundColor: colors.background,
        }}
      >
        <Text style={[genericText]}>Network Status</Text>
        {isFetching && <ActivityIndicator style={{ marginRight: 10 }} />}
      </View>
    );
  }
}

const mapStateToProps = (state: ReducerState) => ({
  network: state.network,
});

export default connect(mapStateToProps)(DataContainer);
