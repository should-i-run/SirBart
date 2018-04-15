/* @flow */
import React from 'react';

import { Animated } from 'react-native';

export default class PulseView extends React.Component<*, { fadeAnim: * }> {
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
      // Animated.timing(
      //   // Animate over time
      //   this.state.fadeAnim, // The animated value to drive
      //   {
      //     toValue: 1, // Animate to opacity: 1 (opaque)
      //     duration: 10000, // Make it take a while
      //   },
      // ),
    ).start(); // Starts the animation
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
