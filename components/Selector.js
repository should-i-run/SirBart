/* @flow */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';

import {
  View,
  Text,
  Animated,
} from 'react-native';

import {
  toggleSelector,
} from '../actions/selectorActions';
import styles from './Selector.styles';

type Props = {
  selectorShown: bool,
  toggleSelector: Function,
};

class Selector extends React.Component {
  props: Props;

  height: Animated.Value = new Animated.Value(0);

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.selectorShown !== nextProps.selectorShown) {
      this.toggle();
    }
  }

  toggle = () => {
    Animated.spring(this.height, {
      toValue: this.props.selectorShown ? 0 : 1,
      friction: 6,
      tension: 70,
    }).start();
  }

  close = () => {
    this.props.toggleSelector();
  }

  render() {
    const {selectorShown} = this.props;
    const bottom = this.height.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -100],
    });
    return (
      <Animated.View
        style={[styles.selector, {
          transform: [{translateY: bottom}],
        }]}>
        <Text style={styles.title}>Heyyy</Text>
        <View style={styles.closeContainer}>
          <Text onPress={this.close} style={styles.close}>X</Text>
        </View>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  selectorShown: state.selectorShown,
});

const mapDispatchToProps = (dispatch: Function) =>
  bindActionCreators({
    toggleSelector,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Selector);
