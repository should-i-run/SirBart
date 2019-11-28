import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeArea, EdgeInsets } from 'react-native-safe-area-context';

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

type TokenProps = {
  contents: string;
  label: string;
  index: string;
  onPress: () => void;
  disabled: boolean;
};

function Token({ contents, label, index, onPress, disabled }: TokenProps) {
  return (
    <TouchableOpacity
      key={index}
      style={[styles.destTokenContainer]}
      // style={[styles.destToken, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={[styles.destToken, disabled && styles.disabled]}>
        <Text style={[styles.destTokenIcon]}>{contents}</Text>
      </View>
      <Text
        numberOfLines={1}
        style={[styles.destTokenLabel, disabled && styles.disabledText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type Props = {
  savedDestinations: SavedDestinations;
  selectedDestinationCode?: string;
  stations?: Station[];
  trips?: Trip[];
  add: Function;
  remove: Function;
  select: Function;
  inset: EdgeInsets;
};

type State = {
  adding: boolean;
  code: string;
  addingLabel?: string | null;
};

class DestinationSelector extends React.Component<Props, State> {
  state = { adding: false, code: 'EMBR', addingLabel: null };
  constructor(props: Props) {
    super(props);
    this.height = new Animated.Value(props.inset.bottom + 105);
  }
  height: Animated.Value;

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (!prevState.adding && this.state.adding) {
      tracker.logEvent('destination_picker_open');
    } else if (prevState.adding && !this.state.adding) {
      tracker.logEvent('destination_picker_close');
    }
    // TODO this is crap
    if (this.state.adding) {
      this.animateToHeight(250);
    } else if (this.props.selectedDestinationCode) {
      this.animateToHeight(100);
    } else {
      this.animateToHeight(125);
    }
  }

  animateToHeight(height: number) {
    Animated.timing(this.height, {
      toValue: height,
      duration: 200,
      easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
    }).start();
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
    const contents = label === 'work' ? '🏢' : '🏡';
    if (!code) {
      return (
        <PulseView>
          <Token
            label={`Set ${label}`}
            contents={contents}
            index={label}
            disabled={false}
            onPress={() => this.setState({ adding: true, addingLabel: label })}
          />
        </PulseView>
      );
    }
    const disabled =
      !stations ||
      (stations.some(s => s.abbr === code) && stations.length === 1);
    return (
      <Token
        label={stationNames[code]}
        contents={contents}
        index={code}
        disabled={disabled}
        onPress={() => this.select(code)}
      />
    );
  };

  renderSelector() {
    const { savedDestinations } = this.props;
    return (
      // {/* <Text style={styles.destTokenLabel}>Show trains to</Text> */}
      <View style={[styles.container, styles.leftRight]}>
        <View style={styles.listContainer}>
          {this.renderSaveableDest('home', savedDestinations.home)}
          {this.renderSaveableDest('work', savedDestinations.work)}
          <Token
            label="Somewhere else"
            contents="🚉"
            index="somewhere"
            disabled={false}
            onPress={() => this.setState({ adding: true })}
          />
        </View>
      </View>
    );
  }

  renderPicker() {
    return (
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
    );
  }

  // TODO
  // If it's home/work, allow to choose a new station
  renderSelected() {
    const { selectedDestinationCode, trips, savedDestinations } = this.props;
    // const { trips, savedDestinations } = this.props;
    // const selectedDestinationCode = 'EMBR';
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
            {` ${stationNames[selectedDestinationCode!]}`}
          </Text>
        </View>
        {!trips && <ActivityIndicator style={{ marginRight: 10 }} />}
        <TouchableOpacity
          style={[{ marginRight: 0, marginLeft: 5 }]}
          onPress={() => this.select(null)}
        >
          {/* <Text style={[styles.genericText, { fontSize: 14 }]}>Clear</Text> */}
          <Icon name="close" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { selectedDestinationCode } = this.props;
    let body: JSX.Element;
    if (this.state.adding) {
      body = this.renderPicker();
    } else if (selectedDestinationCode) {
      body = this.renderSelected();
    } else {
      body = this.renderSelector();
    }
    return (
      <Animated.View style={[styles.wrapper, { height: this.height }]}>
        {body}
      </Animated.View>
    );
  }
}
function DestinationSelectorWrapper(props: Omit<Props, 'inset'>) {
  const inset = useSafeArea();
  return <DestinationSelector {...props} inset={inset} />;
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
)(DestinationSelectorWrapper);
