/* @flow */
// import { bindActionCreators, Dispatch } from 'redux';
// import { connect } from 'react-redux';
import * as React from 'react';
import { Text, View } from 'react-native';

// import { showSelector, hideSelector, SelectorKinds } from '../actions/selectorActions';
// import tracker from '../native/ga';

import { Station } from '../reducers/appStore';
import styles from './StationName.styles';

type Props = {
  station: Station;
  distance?: number;
  // showSelector: Function;
  // hideSelector: Function;
  // selectorShown: boolean;
  // selectionData?: SelectionData;
  // selectionKind?: SelectorKinds;
};

class StationView extends React.Component<Props> {
  // goToDirections = () => {
  //   const { selectorShown, selectionData, selectionKind, station } = this.props;
  //   if (selectorShown && selectionData && selectionKind === 'distance') {
  //     const isSelected = selectionData.station.abbr === station.abbr;
  //     if (isSelected) {
  //       this.props.hideSelector();
  //       tracker.logEvent('hide_selector_station');
  //       return;
  //     }
  //   }
  //   this.props.showSelector(SelectorKinds.distance, { station: this.props.station });
  //   tracker.logEvent('show_selector_station');
  // };

  render() {
    const { station, distance } = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <View style={styles.stationName}>
          <Text style={styles.stationNameText} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
        <View style={[styles.stationDistance]}>
          <Text style={styles.stationDistanceText} numberOfLines={1}>
            {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
          </Text>
        </View>
      </View>
    );
  }
}

// const mapStateToProps = (state: ReducerState) => ({
//   selectorShown: state.selectorShown,
//   selectionData: state.selectionData,
//   selectionKind: state.selectionKind,
// });

// const mapDispatchToProps = (dispatch: Dispatch<any>) =>
//   bindActionCreators(
//     {
//       showSelector,
//       hideSelector,
//     },
//     dispatch,
//   );

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(StationView);

export default StationView;
