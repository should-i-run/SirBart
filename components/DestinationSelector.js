/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import invariant from 'invariant';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  selectDestination,
  destinationAdd,
  destinationRemove,
} from '../actions/destinationActions';
import type {Station} from '../reducers/appStore';

import StationPicker from './StationPicker';
// import tracker from '../native/ga';


import styles from './DestinationSelector.styles';

type Props = {
  savedDestinations: string[],
  selectedDestinationCode: ?string,
  stations: ?Station[],
  add: Function,
  remove: Function,
  select: Function,
};

class DestinationSelector extends React.Component {
  props: Props;
  state = {adding: false};

  add = (code) => {
    this.props.add(code);
  };

  remove = () => {
    this.props.remove('24TH');
  };

  select = (code: ?string) => {
    if (this.props.stations) {
      const stationCodes = this.props.stations.map((s: Station) => s.abbr);
      this.props.select(code, stationCodes);
    }
  };

  renderDest = (code: string) => {
    return (
      <TouchableOpacity
        key={code}
        onPress={() => this.select(code)}>
        <Text style={styles.label}>{code}</Text>
      </TouchableOpacity>
    );
  };

  renderSelected() {
    const {selectedDestinationCode} = this.props;
    invariant(selectedDestinationCode, 'renderSelected called without a selectedDestinationCode');
    return (
      <View style={styles.container}>
        <Text style={styles.label} key={selectedDestinationCode}>
          Showing trains to:
          {` ${selectedDestinationCode}`}
        </Text>

        <TouchableOpacity onPress={() => this.select(null)}>
          <Icon name="times" size={20} color="#E6E6E6" />
        </TouchableOpacity>
      </View>
    );
  }

  renderSome() {
    const {savedDestinations} = this.props;
    return (
      <View style={[styles.container, styles.leftRight]}>
        {savedDestinations.map(this.renderDest)}
        <TouchableOpacity style={styles.container} onPress={() => this.setState({adding: true})}>
          <Icon name="plus-square" size={20} color="#E6E6E6" />
        </TouchableOpacity>
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
          <TouchableOpacity onPress={() => this.setState({adding: false})}>
            <Text style={styles.genericText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <StationPicker
          onSelect={(code) => {
            this.add(code);
            this.select(code);
            this.setState({adding: false});
          }}
          onClose={() => this.setState({adding: false})}
        />
      </View>
    );
  }

  renderEmpty() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => this.setState({adding: true})}>
        <Text style={styles.label}>Add a destination</Text>
        <Icon name="plus-square" size={20} color="#E6E6E6" />
      </TouchableOpacity>
    );
  }

  render() {
    const {savedDestinations, selectedDestinationCode} = this.props;
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
    return (
      <View style={styles.wrapper}>
        {body}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  savedDestinations: state.savedDestinations,
  selectedDestinationCode: state.selectedDestinationCode,
  stations: state.stations,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    add: destinationAdd,
    remove: destinationRemove,
    select: selectDestination,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DestinationSelector);
