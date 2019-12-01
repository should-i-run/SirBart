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

import {
  State as ReducerState,
  SelectedDestination,
} from '../reducers/appStore';
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

function iconNameForLabel(label: 'home' | 'work' | 'somewhere') {
  if (label === 'work') return 'briefcase';
  if (label === 'home') return 'home';
  return 'random';
}

function LabelIcon({
  label,
  addToSize,
  color = colors.lightText,
}: {
  label: 'home' | 'work' | 'somewhere';
  addToSize?: number;
  color?: string;
}) {
  const size = label === 'home' ? 28 : 24;
  return (
    <Icon
      name={iconNameForLabel(label)}
      size={size + (addToSize || 0)}
      color={color}
    />
  );
}

type TokenProps = {
  destinationLabel: 'home' | 'work' | 'somewhere';
  label: string;
  onPress: () => void;
  disabled: boolean;
};

function Token({ destinationLabel, label, onPress, disabled }: TokenProps) {
  return (
    <TouchableOpacity
      key={destinationLabel}
      style={[styles.destTokenContainer]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={[styles.destToken]}>
        <LabelIcon
          label={destinationLabel}
          addToSize={8}
          color={disabled ? colors.disabledText : colors.button}
        />
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
  selectedDestination?: SelectedDestination;
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
  addingLabel?: 'home' | 'work' | null;
};

const PICKER_HEIGHT = 230;
const SELECTOR_HEIGHT = 70;
const SELECTED_HEIGHT = 54;

class DestinationSelector extends React.Component<Props, State> {
  state = { adding: false, code: 'EMBR', addingLabel: null };
  constructor(props: Props) {
    super(props);
    this.height = new Animated.Value(props.inset.bottom + SELECTOR_HEIGHT);
  }
  height: Animated.Value;

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (!prevState.adding && this.state.adding) {
      tracker.logEvent('destination_picker_open');
      if (!this.props.stations) {
        // TODO does this actually happen? If so, prevent initial destination setting without stations.
        tracker.logEvent('error_adding_without_stations');
      }
    } else if (prevState.adding && !this.state.adding) {
      tracker.logEvent('destination_picker_close');
    }
    if (this.state.adding) {
      this.animateToHeight(PICKER_HEIGHT);
    } else if (this.props.selectedDestination) {
      this.animateToHeight(SELECTED_HEIGHT);
    } else {
      this.animateToHeight(SELECTOR_HEIGHT);
    }
  }

  animateToHeight(height: number) {
    Animated.timing(this.height, {
      toValue: height + this.props.inset.bottom,
      duration: 400,
      easing: Easing.elastic(1),
    }).start();
  }

  save = (label: string | null, code: string | null) => {
    if (!label) {
      tracker.logEvent('somewhere_else');
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

  select = (code?: string | null, label?: 'work' | 'home') => {
    if (this.props.stations) {
      const stationCodes = this.props.stations.map((s: Station) => s.abbr);
      if (code) {
        tracker.logEvent('select_destination');
      } else {
        tracker.logEvent('clear_selected_destination');
      }
      this.props.select(code, stationCodes, label);
    }
  };

  renderSaveableDest = (label: 'home' | 'work', code?: string) => {
    const { stations } = this.props;
    if (!code) {
      return (
        <PulseView>
          <Token
            label={`Set ${label}`}
            destinationLabel={label}
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
        destinationLabel={label}
        disabled={disabled}
        onPress={() => this.select(code, label)}
      />
    );
  };

  renderSelector() {
    const { savedDestinations, stations } = this.props;
    return (
      <View style={styles.selectorItemsContainer}>
        {this.renderSaveableDest('home', savedDestinations.home)}
        {this.renderSaveableDest('work', savedDestinations.work)}
        <Token
          label="Somewhere else"
          destinationLabel="somewhere"
          disabled={!stations}
          onPress={() => this.setState({ adding: true })}
        />
      </View>
    );
  }

  renderPicker() {
    return (
      <View>
        <View style={styles.leftRight}>
          <TouchableOpacity
            onPress={() => this.setState({ adding: false, code: 'EMBR' })}
          >
            <Text style={styles.genericText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.save(this.state.addingLabel, this.state.code);
              this.select(this.state.code, this.state.addingLabel!);
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

  renderSelected() {
    const { selectedDestination, trips } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={[
            {
              position: 'absolute',
              right: -5,
              top: -5,
              zIndex: 1, // Allows it to receive touch events first
            },
          ]}
          onPress={() => this.select(null)}
        >
          <Icon name="times-circle" size={30} color={colors.lightText} />
        </TouchableOpacity>
        <View
          style={[
            {
              alignItems: 'center',
              flexDirection: 'row',
              marginRight: 25,
            },
          ]}
        >
          <LabelIcon
            label={selectedDestination?.label || 'somewhere'}
            addToSize={8}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              numberOfLines={1}
              style={styles.label}
              key={selectedDestination?.code}
            >
              Going to
              {` ${stationNames[selectedDestination?.code!]}`}
            </Text>
            {selectedDestination?.label && (
              <TouchableOpacity
                onPress={() => {
                  tracker.logEvent('change_destination');
                  this.setState({
                    adding: true,
                    addingLabel: selectedDestination.label,
                  });
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.destTokenLabel, { color: colors.button }]}
                >
                  Choose a new {selectedDestination.label} station
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {!trips && (
            <ActivityIndicator size="large" style={{ marginHorizontal: 10 }} />
          )}
        </View>
      </View>
    );
  }

  render() {
    const { selectedDestination } = this.props;
    let body: JSX.Element;
    if (this.state.adding) {
      body = this.renderPicker();
    } else if (selectedDestination) {
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
  selectedDestination: state.selectedDestination,
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
