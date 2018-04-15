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
import PulseView from './PulseView';
import { stationNames } from '../utils/stations';

import tracker from '../native/ga';

import styles from './DestinationSelector.styles';

type Props = {
  savedDestinations: SavedDestinations,
  selectedDestinationCode: ?string,
  stations: ?(Station[]),
  trips: ?any,
  add: Function,
  remove: Function,
  select: Function,
};

type State = {
  adding: boolean,
  code: string,
  addingLabel: ?string,
};

class DestinationSelector extends React.Component<Props, State> {
  state = { adding: false, code: 'EMBR', addingLabel: null };

  componentDidUpdate(prevProps: Props, prevState: Object) {
    const { savedDestinations, stations, selectedDestinationCode } = this.props;

    const previousEligibleDestinations = Object.values(prevProps.savedDestinations).filter(
      d => !prevProps.stations || !prevProps.stations.some(s => s.abbr === d),
    );
    const currentEligibleDestinations = Object.values(savedDestinations).filter(
      d => !stations || !stations.some(s => s.abbr === d),
    );
    if (
      currentEligibleDestinations.length !== previousEligibleDestinations.length &&
      currentEligibleDestinations.length === 1 &&
      !selectedDestinationCode
    ) {
      tracker.trackEvent('auto', 'auto-select-destination');
      this.select(currentEligibleDestinations[0]);
    }
    if (!prevState.adding && this.state.adding) {
      tracker.trackScreenView('destination-picker');
      tracker.trackEvent('interaction', 'destination-picker-open');
    } else if (prevState.adding && !this.state.adding) {
      tracker.trackEvent('interaction', 'destination-picker-close');
    }
  }

  add = (label, code) => {
    if (!label) {
      tracker.trackEvent('interaction', 'add-temp-destination');
      return;
    }
    tracker.trackEvent('interaction', 'add-destination');
    this.props.add(label, code);
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
      // if (!stationCodes.includes(code)) {
      tracker.trackEvent('interaction', 'select-destination');
      this.props.select(code, stationCodes);
      // }
    }
  };

  renderLabelIcon = (label: ?string) => {
    if (!label) {
      return null;
    }
    return (
      <Text>
        <Icon
          name={label === 'work' ? 'building' : 'home'}
          size={20}
          color="#E6E6E6"
          style={{ paddingRight: 5 }}
        />{' '}
      </Text>
    );
  };

  renderSaveableDest = (label: string, code: ?string) => {
    const { stations } = this.props;
    if (!code) {
      return (
        <PulseView>
          <TouchableOpacity
            style={[styles.destToken]}
            onPress={() => this.setState({ adding: true, addingLabel: label })}
          >
            <Text style={[styles.label, { fontSize: 18 }]}>Add {label}</Text>
          </TouchableOpacity>
        </PulseView>
      );
    }
    const disabled = !stations || stations.some(s => s.abbr === code);
    return (
      <TouchableOpacity
        key={code}
        style={[styles.destToken, disabled && styles.disabled]}
        disabled={disabled}
        onPress={() => this.select(code)}
      >
        <Text numberOfLines={1} style={[styles.label, disabled && styles.disabledText]}>
          {this.renderLabelIcon(label)}
          {stationNames[code]}
        </Text>
      </TouchableOpacity>
    );
  };

  renderSelected() {
    const { selectedDestinationCode, trips, savedDestinations } = this.props;
    invariant(selectedDestinationCode, 'renderSelected called without a selectedDestinationCode');
    const matchedSavedLabel =
      selectedDestinationCode === savedDestinations.home
        ? 'home'
        : selectedDestinationCode === savedDestinations.work
          ? 'work'
          : null;
    return (
      <View style={[styles.container, styles.leftRight]}>
        <View style={[styles.leftRight, { flex: 1 }]}>
          <Text numberOfLines={1} style={styles.label} key={selectedDestinationCode}>
            {this.renderLabelIcon(matchedSavedLabel)}
            Showing trains to
            {` ${stationNames[selectedDestinationCode]}`}
          </Text>
          {!trips && <ActivityIndicator style={{ marginRight: 10 }} />}
        </View>
        <TouchableOpacity style={[styles.destToken]} onPress={() => this.select(null)}>
          <Text style={[styles.genericText, { fontSize: 14 }]}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSelector() {
    const { savedDestinations } = this.props;
    return (
      <View style={[styles.container, styles.leftRight]} horizontal>
        <ScrollView style={{ height: 35 }} horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {this.renderSaveableDest('home', savedDestinations.home)}
            {this.renderSaveableDest('work', savedDestinations.work)}
            <TouchableOpacity
              // style={[{ height: 40 }]}
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
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.leftRight}>
            <TouchableOpacity onPress={() => this.setState({ adding: false, code: 'EMBR' })}>
              <Text style={styles.genericText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.add(this.state.addingLabel, this.state.code);
                this.select(this.state.code);
                this.setState({ adding: false, code: 'EMBR' });
              }}
            >
              <Text style={[styles.genericText, { height: 40 }]}>Select</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.picker}>
            <StationPicker
              selectedValue={this.state.code}
              onSelect={code => this.setState({ code })}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { selectedDestinationCode } = this.props;
    let body;
    if (this.state.adding) {
      body = this.renderPicker();
    } else if (selectedDestinationCode) {
      body = this.renderSelected();
    } else {
      body = this.renderSelector();
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
