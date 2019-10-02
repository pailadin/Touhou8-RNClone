import React, { PureComponent } from "react"
import { Animated, Button, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { vw, vh } from "react-native-expo-viewport-units";

import { MAX_X, MAX_Y, MAX_X_PLAYER, MAX_Y_PLAYER, PLAYER_HITBOX_SIZE as HITBOX_SIZE } from "~/constants/dimensions";
const PLAYER_IMAGE = require("$/sprites/Player.gif")

const CONTROL_RADIUS = vh(35);

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
    zIndex: 2000,
  },
  image: {
    position: "absolute",
    transform: ([{ scaleX: 1.5 }, { scaleY: 1.5 }]),
    zIndex: 2001,
  },
  hitbox: {
    backgroundColor: "red",
    position: "absolute",
    width: HITBOX_SIZE,
    height: HITBOX_SIZE,
    borderRadius: HITBOX_SIZE, // Cosmetic. Still treated as a box.
    borderWidth: 1,
    borderColor: "#FFF",
    zIndex: 2002,
  }
});

const getPlayerHitboxValues = (x, y) => {
  const HALF_HITBOX_SIZE = HITBOX_SIZE / 2;

  const playerLeft = x - HALF_HITBOX_SIZE;
  const playerRight = x + HALF_HITBOX_SIZE;
  const playerTop = y - HALF_HITBOX_SIZE;
  const playerBottom = y + HALF_HITBOX_SIZE;

  return { playerLeft, playerRight, playerTop, playerBottom };
}

export default class Player extends PureComponent {
  static propTypes = {
    initialX: PropTypes.number,
    initialY: PropTypes.number,
  }

  static defaultProps = {
    initialX: 0,
    initialY: MAX_Y_PLAYER - vh(3),
  }

  updatePlayerLocation = (x, y) => this.setState({
    playerX: x,
    playerY: y,
    ...getPlayerHitboxValues(x, y),
  });

  constructor(props) {
    super(props);

    this.gestureOffset = { x: this.props.initialX, y: this.props.initialY };
    this.gestureValue = new Animated.ValueXY({ x: this.props.initialX, y: this.props.initialY });
    this.gestureValue.addListener(({ x, y }) => {
      this.updatePlayerLocation(x, y);
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

    this.state = {
      playerX: this.props.initialX,
      playerY: this.props.initialY,
      ...getPlayerHitboxValues(this.props.initialX, this.props.initialY),
    };
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

        {this.props.render({ ...this.state })}
      </>
    );
  }
}
