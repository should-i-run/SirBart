import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { State as ReducerState } from '../reducers/appStore';
import tracker from '../native/analytics';

import { colors } from '../styles';
import {
  selectDestination,
  destinationAdd,
  destinationRemove,
} from '../actions/destinationActions';
import { Station } from '../reducers/appStore';
import StationPicker from './StationPicker';
import PulseView from './PulseView';
import { stationNames } from '../utils/stations';

import styles from './DestinationSelector.styles';

type Props = {
  savedDestinations: SavedDestinations;
  selectedDestinationCode?: string;
  stations?: Station[];
  trips?: Trip[];
  add: Function;
  remove: Function;
  select: Function;
};

type State = {
  adding: boolean;
  code: string;
  addingLabel?: string | null;
};

class DestinationSelector extends React.Component<Props, State> {
  state = { adding: false, code: 'EMBR', addingLabel: null };

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (!prevState.adding && this.state.adding) {
      tracker.logEvent('destination_picker_open');
    } else if (prevState.adding && !this.state.adding) {
      tracker.logEvent('destination_picker_close');
    }
  }

  // TODO It looks like this is called without a label too often
  save = (label: string | null, code: string | null) => {
    if (!label) {
      tracker.logEvent('add_temp_destination');
      return;
    }
    tracker.logEvent('add_destination');
    this.props.add(label, code);
  };

  remove = () => {
    tracker.logEvent('remove_destinations');
    const confirmRemove = () => {
      tracker.logEvent('remove_destinations_confirm');
      this.props.remove();
    };
    const cancelRemove = () => {
      tracker.logEvent('remove_destinations_cancel');
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

  select = (code?: string | null) => {
    if (this.props.stations) {
      const stationCodes = this.props.stations.map((s: Station) => s.abbr);
      if (code) {
        tracker.logEvent('select_destination');
      } else {
        tracker.logEvent('clear_selected_destination');
      }
      this.props.select(code, stationCodes);
    }
  };

  renderLabelIcon = (label?: string, disabled?: boolean) => {
    if (!label) {
      return null;
    }
    return (
      <Text>
        <Text
          style={[
            styles.genericText,
            {
              fontSize: 20,
              paddingRight: 5,
              color: disabled ? colors.disabledText : '#E6E6E6',
            },
          ]}
        >
          {label === 'work' ? '🏢' : '🏡'}
        </Text>{' '}
      </Text>
    );
  };

  renderSaveableDest = (label: string, code?: string) => {
    const { stations } = this.props;
    if (!code) {
      return (
        <PulseView>
          <TouchableOpacity
            style={[styles.destToken]}
            onPress={() => this.setState({ adding: true, addingLabel: label })}
          >
            <Text style={[styles.label, { fontSize: 18 }]}>
              Add {label === 'work' ? 'Work' : 'Home'}
            </Text>
          </TouchableOpacity>
        </PulseView>
      );
    }
    const disabled =
      !stations ||
      (stations.some(s => s.abbr === code) && stations.length === 1);
    return (
      <TouchableOpacity
        key={code}
        style={[styles.destToken, disabled && styles.disabled]}
        disabled={disabled}
        onPress={() => this.select(code)}
      >
        <Text
          numberOfLines={1}
          style={[styles.label, disabled && styles.disabledText]}
        >
          {this.renderLabelIcon(label, disabled)}
          {stationNames[code]}
        </Text>
      </TouchableOpacity>
    );
  };

  renderSelector() {
    const { savedDestinations } = this.props;
    return (
      <View style={[styles.container, styles.leftRight]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {this.renderSaveableDest('home', savedDestinations.home)}
            {this.renderSaveableDest('work', savedDestinations.work)}
            <TouchableOpacity onPress={() => this.setState({ adding: true })}>
              <Icon name="plus" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.listContainer}>
          <TouchableOpacity onPress={this.remove} style={{ marginRight: 10 }}>
            <Icon name="trash" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderPicker() {
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.leftRight}>
            <TouchableOpacity
              onPress={() => this.setState({ adding: false, code: 'EMBR' })}
            >
              <Text style={styles.genericText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.save(this.state.addingLabel, this.state.code);
                this.select(this.state.code);
                this.setState({
                  adding: false,
                  code: 'EMBR',
                  addingLabel: null,
                });
              }}
            >
              <Text style={[styles.genericText]}>Select</Text>
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

  renderSelected() {
    const { selectedDestinationCode, trips, savedDestinations } = this.props;
    if (!selectedDestinationCode) return;
    const matchedSavedLabel =
      selectedDestinationCode === savedDestinations.home
        ? 'home'
        : selectedDestinationCode === savedDestinations.work
        ? 'work'
        : undefined;
    return (
      <View style={[styles.container, styles.leftRight]}>
        <View style={[styles.leftRight, { flex: 1 }]}>
          <Text
            numberOfLines={1}
            style={styles.label}
            key={selectedDestinationCode}
          >
            {this.renderLabelIcon(matchedSavedLabel)}
            Showing trains to
            {` ${stationNames[selectedDestinationCode]}`}
          </Text>
        </View>
        {!trips && <ActivityIndicator style={{ marginRight: 10 }} />}
        <TouchableOpacity
          style={[styles.destToken, { marginRight: 0, marginLeft: 5 }]}
          onPress={() => this.select(null)}
        >
          <Text style={[styles.genericText, { fontSize: 14 }]}>Clear</Text>
        </TouchableOpacity>
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

const mapStateToProps = (state: ReducerState) => ({
  savedDestinations: state.savedDestinations,
  selectedDestinationCode: state.selectedDestinationCode,
  stations: state.stations,
  trips: state.trips,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      add: destinationAdd,
      remove: destinationRemove,
      select: selectDestination,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DestinationSelector);
