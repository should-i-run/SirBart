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
  label: string;
  icon: string;
  onPress: () => void;
  disabled: boolean;
};

function Token({ icon, label, onPress, disabled }: TokenProps) {
  return (
    <TouchableOpacity
      key={icon}
      style={[styles.destTokenContainer]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={[styles.destToken, disabled && styles.disabled]}>
        <Icon name={icon} size={24} color={colors.lightText} />
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

const PICKER_HEIGHT = 230;
const SELECTOR_HEIGHT = 70;
const SELECTED_HEIGHT = 70;

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
    } else if (prevState.adding && !this.state.adding) {
      tracker.logEvent('destination_picker_close');
    }
    // TODO this is crap
    const { bottom } = this.props.inset;
    if (this.state.adding) {
      this.animateToHeight(PICKER_HEIGHT + bottom);
    } else if (this.props.selectedDestinationCode) {
      this.animateToHeight(SELECTED_HEIGHT + bottom);
    } else {
      this.animateToHeight(SELECTOR_HEIGHT + bottom);
    }
  }

  animateToHeight(height: number) {
    Animated.timing(this.height, {
      toValue: height,
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

  renderSaveableDest = (label: string, code?: string) => {
    const { stations } = this.props;
    // TODO Extract icon logic into component
    const contents = label === 'work' ? 'briefcase' : 'home';
    if (!code) {
      return (
        <PulseView>
          <Token
            label={`Set ${label}`}
            icon={contents}
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
        icon={contents}
        disabled={disabled}
        onPress={() => this.select(code)}
      />
    );
  };

  renderSelector() {
    const { savedDestinations } = this.props;
    return (
      <View style={styles.selectorItemsContainer}>
        {this.renderSaveableDest('home', savedDestinations.home)}
        {this.renderSaveableDest('work', savedDestinations.work)}
        <Token
          label="Somewhere else"
          icon="random"
          disabled={false}
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
    const matchedSavedLabel =
      selectedDestinationCode === savedDestinations.home
        ? 'home'
        : selectedDestinationCode === savedDestinations.work
        ? 'work'
        : undefined;
    const contents = matchedSavedLabel === 'work' ? 'briefcase' : 'home';
    return (
      <View style={[styles.leftRight]}>
        <View style={[styles.leftRight, { flex: 1 }]}>
          <Text
            numberOfLines={1}
            style={styles.label}
            key={selectedDestinationCode}
          >
            {matchedSavedLabel && (
              <Icon name={contents} size={24} color={colors.lightText} />
            )}{' '}
            Showing trains to
            {` ${stationNames[selectedDestinationCode!]}`}
          </Text>
        </View>
        {!trips && <ActivityIndicator style={{ marginRight: 10 }} />}
        <TouchableOpacity
          style={[{ marginRight: 0, marginLeft: 5 }]}
          onPress={() => this.select(null)}
        >
          <Icon name="times-circle" size={24} color={colors.lightText} />
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
