import React, { PureComponent } from "react"
import { Animated, Button, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import { PLAY_AREA_HEIGHT_VH, PLAY_AREA_WIDTH_VW } from "~/constants/dimensions";
const PLAYER_IMAGE = require("$/sprites/reimu.gif")

const CIRCLE_RADIUS = vh(10);
const MAX_X = vw((PLAY_AREA_WIDTH_VW/2)-3);
const MAX_Y = vh((PLAY_AREA_HEIGHT_VH/2)-3);

const styles = StyleSheet.create({
  draggable: {
    backgroundColor: "transparent",
    // backgroundColor: "skyblue",
    width: CIRCLE_RADIUS * 3,
    height: CIRCLE_RADIUS * 3,
    borderRadius: CIRCLE_RADIUS,
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default class Player extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { x: 0, y: MAX_Y - vh(3) };

    this.gestureOffset = { x: this.state.x, y: this.state.y };
    this.gestureValue = new Animated.ValueXY({ x: this.state.x, y: this.state.y });
    this.gestureValue.addListener(({ x, y }) => {
      this.setState({ x, y });
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (_, { dx, dy }) => {
        let x = this.gestureOffset.x + dx;
        let y = this.gestureOffset.y + dy;

        if (x > MAX_X) {
          x = MAX_X;
        } else if (x < -MAX_X) {
          x = -MAX_X;
        }

        if (y > MAX_Y) {
          y = MAX_Y;
        } else if (y < -MAX_Y) {
          y = -MAX_Y;
        }

        this.gestureValue.setValue({ x,  y });
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        this.gestureOffset.x += dx;
        this.gestureOffset.y += dy;
      },
    });
  }

  render() {
    return (
      <Animated.View
        style={{
          transform: [
            { translateX: this.gestureValue.x },
            { translateY: this.gestureValue.y },
          ],
          ...styles.draggable,
        }}
        {...this.panResponder.panHandlers}
      >
        <Image source={PLAYER_IMAGE} />
      </Animated.View>
    );
  }
}
