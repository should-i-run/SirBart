/* @flow */
import * as React from 'react';

import { Animated } from 'react-native';

export default class PulseView extends React.Component<any, { fadeAnim: any }> {
  state = {
    fadeAnim: new Animated.Value(0.5),
  };

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 1000,
          // delay: 1000
        }),
        Animated.timing(this.state.fadeAnim, {
          toValue: 0.5,
          duration: 1000,
        }),
      ]),
    ).start();
  }

  render() {
    const { fadeAnim } = this.state;

    return (
      <Animated.View // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim, // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
