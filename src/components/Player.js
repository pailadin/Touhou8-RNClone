import React, { PureComponent } from "react"
import { Animated, Button, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { vw, vh } from "react-native-expo-viewport-units";

import { MAX_X, MAX_Y, MAX_X_PLAYER, MAX_Y_PLAYER, PLAYER_HITBOX_SIZE as HITBOX_SIZE } from "~/constants/dimensions";
const PLAYER_IMAGE = require("$/sprites/Player.gif")

const CONTROL_RADIUS = vh(25);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    // backgroundColor: "skyblue",
    width: CONTROL_RADIUS,
    height: CONTROL_RADIUS,
    borderRadius: CONTROL_RADIUS,
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
  },
  hitbox: {
    backgroundColor: "red",
    position: "absolute",
    width: HITBOX_SIZE,
    height: HITBOX_SIZE,
    borderRadius: HITBOX_SIZE, // Cosmetic. Still treated as a box.
    borderWidth: 1,
    borderColor: "#FFF",
    zIndex: 1100,
  }
});

export default class Player extends PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    updatePlayerLocation: PropTypes.func.isRequired,
  }

  static defaultProps = {
    updatePlayerLocation: () => null
  }

  constructor(props) {
    super(props);

    this.gestureOffset = { x: this.props.x, y: this.props.y };
    this.gestureValue = new Animated.ValueXY({ x: this.props.x, y: this.props.y });
    this.gestureValue.addListener(({ x, y }) => {
      this.props.updatePlayerLocation(x, y);
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (_, { dx, dy }) => {
        let x = this.gestureOffset.x + dx;
        let y = this.gestureOffset.y + dy;

        if (x > MAX_X_PLAYER) {
          x = MAX_X_PLAYER;
        } else if (x < -MAX_X_PLAYER) {
          x = -MAX_X_PLAYER;
        }

        if (y > MAX_Y_PLAYER) {
          y = MAX_Y_PLAYER;
        } else if (y < -MAX_Y_PLAYER) {
          y = -MAX_Y_PLAYER;
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
      <>
        <Animated.View
          style={{
            transform: [
              { translateX: this.gestureValue.x },
              { translateY: this.gestureValue.y },
            ],
            ...styles.container,
          }}
          {...this.panResponder.panHandlers}
        >
          <Image source={PLAYER_IMAGE} style={styles.image} />

          <View style={styles.hitbox} />
        </Animated.View>
      </>
    );
  }
}
