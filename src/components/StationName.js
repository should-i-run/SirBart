/* @flow */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { showSelector, hideSelector } from '../actions/selectorActions';
import tracker from '../native/ga';

import type { Station } from '../reducers/appStore';
import styles from './StationName.styles';

type Props = {
  station: Station,
  distance: ?number,
  showSelector: Function,
  hideSelector: Function,
  selectorShown: boolean,
  selectionData: ?Object,
  selectionKind: 'distance' | 'departure',
};

class StationView extends React.Component {
  props: Props;

  goToDirections = () => {
    const { selectorShown, selectionData, selectionKind, station } = this.props;
    if (selectorShown && selectionData && selectionKind === 'distance') {
      const isSelected = selectionData.station.abbr === station.abbr;
      if (isSelected) {
        this.props.hideSelector();
        tracker.trackEvent('interaction', 'hide-selector-station');
        return;
      }
    }
    this.props.showSelector('distance', { station: this.props.station });
    tracker.trackEvent('interaction', 'show-selector-station');
  };

  render() {
    const { station, distance } = this.props;
    return (
      <View style={styles.stationNameContainer}>
        <TouchableOpacity onPress={this.goToDirections} style={styles.stationName}>
          <Text style={styles.stationNameText} numberOfLines={1}>
            {station.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToDirections} style={[styles.stationDistance]}>
          <Text style={styles.stationDistanceText} numberOfLines={1}>
            {typeof distance === 'number' ? distance.toLocaleString() : '...'} meters
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectorShown: state.selectorShown,
  selectionData: state.selectionData,
  selectionKind: state.selectionKind,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators(
    {
      showSelector,
      hideSelector,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(StationView);
