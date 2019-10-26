import { connect } from 'react-redux';
import * as React from 'react';
import { State as ReducerState, NetworkStatus } from '../reducers/appStore';

type Props = {
  network: Record<string, NetworkStatus>;
};

class NetworkStatusLog extends React.Component<Props> {
  state = {
    fakeRefreshing: false,
  };

  render() {
    // const { network } = this.props;
    // const urls = Object.keys(network).filter(
    //   k => network[k] === NetworkStatus.Fetching,
    // );
    // console.log(network)
    // return (
    //   <View
    //     style={{
    //       height: 20,
    //       backgroundColor: colors.layer1,
    //     }}
    //   >
    //     <Text style={[genericText, { fontSize: 10 }]}>{urls.join('')}</Text>
    //   </View>
    // );
    return null;
  }
}

const mapStateToProps = (state: ReducerState) => ({
  network: state.network,
});

export default connect(mapStateToProps)(NetworkStatusLog);
