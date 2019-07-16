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
    const urls = Object.keys(network).filter(
      k => network[k] === NetworkStatus.Fetching,
    );
    console.log(network);
    return (
      <View
        style={{
          height: 20,
          backgroundColor: colors.background,
        }}
      >
        <Text style={[genericText, { fontSize: 10 }]}>{urls.join('')}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: ReducerState) => ({
  network: state.network,
});

export default connect(mapStateToProps)(DataContainer);
