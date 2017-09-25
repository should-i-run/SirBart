/* @flow */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import invariant from 'invariant';

import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';

import {
  selectDestination,
  destinationAdd,
  destinationRemove,
} from '../actions/destinationActions';
import type { Station } from '../reducers/appStore';

import StationPicker from './StationPicker';
import { stationNames } from '../utils/stations';

import tracker from '../native/ga';

import styles from './DestinationSelector.styles';

type Props = {
  savedDestinations: string[],
  selectedDestinationCode: ?string,
  stations: ?(Station[]),
  trips: ?any,
  add: Function,
  remove: Function,
  select: Function,
};

class DestinationSelector extends React.Component {
  props: Props;
  state = { adding: false, code: 'EMBR' };

  componentDidUpdate(prevProps: Props, prevState: Object) {
    const { savedDestinations, stations, selectedDestinationCode } = this.props;
    const oldDests = prevProps.savedDestinations.filter(
      d => !prevProps.stations || !prevProps.stations.some(s => s.abbr === d),
    );
    const newDests = savedDestinations.filter(d => !stations || !stations.some(s => s.abbr === d));
    if (newDests.length !== oldDests.length && newDests.length === 1 && !selectedDestinationCode) {
      tracker.trackEvent('auto', 'auto-select-destination');
      this.select(newDests[0]);
    }
    if (!prevState.adding && this.state.adding) {
      tracker.trackScreenView('destination-picker');
      tracker.trackEvent('interaction', 'destination-picker-open');
    } else if (prevState.adding && !this.state.adding) {
      tracker.trackEvent('interaction', 'destination-picker-close');
    }
  }

  add = code => {
    tracker.trackEvent('interaction', 'add-destination');
    this.props.add(code);
  };

  remove = () => {
    tracker.trackEvent('interaction', 'remove-destinations');
    const confirmRemove = () => {
      tracker.trackEvent('interaction', 'remove-destinations-confirm');
      this.props.remove();
    };
    const cancelRemove = () => {
      tracker.trackEvent('interaction', 'remove-destinations-cancel');
    };
    Alert.alert(
      'Clear destinations',
      'Are you sure you want to clear all of your saved destinations?',
      [
        { text: 'Cancel', onPress: cancelRemove },
        { text: 'Clear', onPress: confirmRemove, style: 'destructive' },
      ],
    );
  };

  select = (code: ?string) => {
    if (this.props.stations) {
      const stationCodes = this.props.stations.map((s: Station) => s.abbr);
      if (!stationCodes.includes(code)) {
        tracker.trackEvent('interaction', 'select-destination');
        this.props.select(code, stationCodes);
      }
    }
  };

  renderDest = (code: string) => {
    const { stations } = this.props;
    const disabled = !stations || stations.some(s => s.abbr === code);
    return (
      <TouchableOpacity
        key={code}
        style={[styles.destToken, disabled && styles.disabled]}
        disabled={disabled}
        onPress={() => this.select(code)}
      >
        <Text numberOfLines={1} style={[styles.label, disabled && styles.disabledText]}>
          {stationNames[code]}
        </Text>
      </TouchableOpacity>
    );
  };

  renderSelected() {
    const { selectedDestinationCode, trips } = this.props;
    invariant(selectedDestinationCode, 'renderSelected called without a selectedDestinationCode');
    return (
      <View style={[styles.container, styles.leftRight]}>
        <View style={[styles.leftRight, { flex: 1 }]}>
          <Text style={styles.label} key={selectedDestinationCode}>
            Trains to
            {` ${stationNames[selectedDestinationCode]}`}
          </Text>
          {!trips && <ActivityIndicator style={{ marginRight: 10 }} />}
        </View>
        <TouchableOpacity style={[styles.clearToken]} onPress={() => this.select(null)}>
          <Text style={[styles.genericText, { fontSize: 14 }]}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSome() {
    const { savedDestinations } = this.props;
    return (
      <View style={[styles.container, styles.leftRight]} horizontal>
        <ScrollView style={{ height: 40 }} horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {savedDestinations.map(this.renderDest)}
            <TouchableOpacity
              style={styles.container}
              onPress={() => this.setState({ adding: true })}
            >
              <Icon name="plus-square" size={20} color="#E6E6E6" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={this.remove}>
          <Icon name="times" size={20} color="#E6E6E6" />
        </TouchableOpacity>
      </View>
    );
  }

  renderPicker() {
    return (
      <View style={styles.pickerContainer}>
        <View style={styles.leftRight}>
          <TouchableOpacity onPress={() => this.setState({ adding: false, code: 'EMBR' })}>
            <Text style={styles.genericText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.add(this.state.code);
              this.select(this.state.code);
              this.setState({ adding: false, code: 'EMBR' });
            }}
          >
            <Text style={[styles.genericText, { height: 40 }]}>Save</Text>
          </TouchableOpacity>
        </View>
        <StationPicker selectedValue={this.state.code} onSelect={code => this.setState({ code })} />
      </View>
    );
  }

  renderEmpty() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => this.setState({ adding: true })}>
        <Text style={styles.label}>Add a destination</Text>
        <Icon style={{ marginLeft: 10 }} name="plus-square" size={20} color="#E6E6E6" />
      </TouchableOpacity>
    );
  }

  render() {
    const { savedDestinations, selectedDestinationCode } = this.props;
    let body;
    if (this.state.adding) {
      body = this.renderPicker();
    } else if (!savedDestinations.length) {
      body = this.renderEmpty();
    } else if (selectedDestinationCode) {
      body = this.renderSelected();
    } else {
      body = this.renderSome();
    }
    return <View style={styles.wrapper}>{body}</View>;
  }
}

const mapStateToProps = state => ({
  savedDestinations: state.savedDestinations,
  selectedDestinationCode: state.selectedDestinationCode,
  stations: state.stations,
  trips: state.trips,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators(
    {
      add: destinationAdd,
      remove: destinationRemove,
      select: selectDestination,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DestinationSelector);
