import React, { Component } from "react"
import { Animated, Button, Easing, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { vw, vh } from "react-native-expo-viewport-units";
import _ from "lodash";
import { intersect, distance } from "mathjs"

import { MAX_X, MAX_Y, LONG_DIAGONAL_LENGTH } from "~/constants/dimensions";

const INNER_RADIUS = vh(1.5);
const OUTER_RADIUS = INNER_RADIUS + vh(2);
const HITBOX_SIZE = vh(1.5);

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "red",
    width: OUTER_RADIUS,
    height: OUTER_RADIUS,
    borderRadius: OUTER_RADIUS,
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    backgroundColor: "white",
    width: INNER_RADIUS,
    height: INNER_RADIUS,
    borderRadius: INNER_RADIUS,
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hitbox: {
    // backgroundColor: "transparent",
    backgroundColor: "blue",
    position: "absolute",
    width: HITBOX_SIZE,
    height: HITBOX_SIZE,
    zIndex: 1000,
  }
});

const calculateToXY = ({
  fromX,
  fromY,
  toX = "RANDOM",
  toY = "RANDOM",
  playerX: currentPlayerX,
  playerY: currentPlayerY
}, initialPlayerX = currentPlayerX, initialPlayerY = currentPlayerY) => {
  const isShootingAtPlayer = toX === "PLAYER" && toY === "PLAYER";

  if (!_.isFinite(toX)) {
    toX = String(toX);

    if (toX === "PLAYER") {
      toX = initialPlayerX;
    } else {
      toX = (Math.floor(Math.random() * MAX_X)) * (Math.random() > 0.5 ? 1 : -1);
    }
  }

  if (!_.isFinite(toY)) {
    toY = String(toY);

    if (toY === "PLAYER") {
      toY = initialPlayerY;
    } else {
      toY = (Math.floor(Math.random() * MAX_Y)) * (Math.random() > 0.5 ? 1 : -1);
    }
  }

  if (isShootingAtPlayer) {
    // Find a point at the edge of the play area to aim the bullet at:
    const startingPoint = [fromX, fromY];
    const currentLineSegment = [startingPoint, [toX, toY]];
    let topDistance, bottomDistance, leftDistance, rightDistance;

    const topIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, -MAX_Y], [LONG_DIAGONAL_LENGTH, -MAX_Y]);
    const bottomIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, MAX_Y], [LONG_DIAGONAL_LENGTH, MAX_Y]);
    const leftIntersection = intersect(...currentLineSegment, [-MAX_X, -LONG_DIAGONAL_LENGTH], [-MAX_X, LONG_DIAGONAL_LENGTH]);
    const rightIntersection = intersect(...currentLineSegment, [MAX_X, -LONG_DIAGONAL_LENGTH], [MAX_X, LONG_DIAGONAL_LENGTH]);

    if (topIntersection) topDistance = distance(startingPoint, topIntersection);
    if (bottomIntersection) bottomDistance = distance(startingPoint, bottomIntersection);
    if (leftIntersection) leftDistance = distance(startingPoint, leftIntersection);
    if (rightIntersection) rightDistance = distance(startingPoint, rightIntersection);

    const playerXY = _.get(
      _.sortBy([
        [topDistance, topIntersection],
        [bottomDistance, bottomIntersection],
        [leftDistance, leftIntersection],
        [rightDistance, rightIntersection],
      ], [x => x[0]]),
      "[0]",
      [0, MAX_Y],
    );

    return { toX: playerXY[1][0], toY: playerXY[1][1] };
  }
  
  return { toX, toY };
}

export default class Bullet extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    fromX: PropTypes.number,
    fromY: PropTypes.number,
    // If not aiming at the player, pass at least ONE point on an edge:
    toX: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Reminder: Use state version of this:
    toY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Reminder: Use state version of this.
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
    removeBullet: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fromX: 0,
    fromY: -MAX_Y,
    removeBullet: () => null,
  }

  constructor(props) {
    super(props);

    this.state = {
      initialPlayerX: props.playerX,
      initialPlayerY: props.playerY,
      ...calculateToXY(props, props.playerX, props.playerY)
    };

    this.xyTranslate = new Animated.ValueXY();

    this.xyTranslate.addListener(bulletXY => {
      this.checkForCollision(bulletXY);
    });
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      ...calculateToXY(props, state.initialPlayerX, state.initialPlayerY)
    };
  }

  checkForCollision({ x, y }) {
    const { playerLeft, playerRight, playerTop, playerBottom } = this.props;

    const HALF_HITBOX_SIZE = (HITBOX_SIZE / 2);
    const actualXPos = (x * MAX_X);
    const actualYPos = (y * MAX_Y);

    const BULLET_X_START = actualXPos - HALF_HITBOX_SIZE;
    const BULLET_X_END = actualXPos + HALF_HITBOX_SIZE;
    const BULLET_Y_START = actualYPos - HALF_HITBOX_SIZE;
    const BULLET_Y_END = actualYPos + HALF_HITBOX_SIZE;

    const DELETE_MESSAGE = (message = "COLLISION") => console.log(`${message}:`, {
      id: this.props.id,
      playerLeft,
      playerRight,
      playerTop,
      playerBottom,
      BULLET_X_START,
      BULLET_X_END,
      BULLET_Y_START,
      BULLET_Y_END,
      MAX_X,
      MAX_Y,
    });

    // Should probably be disabled until we can find a way to get the bullet x and y synchronously:
    // if (!(
    //   (playerRight < BULLET_X_START) ||
    //   (playerLeft > BULLET_X_END) ||
    //   (playerTop > BULLET_Y_END) ||
    //   (playerBottom < BULLET_Y_START)
    // )) {
    //   DELETE_MESSAGE();

    //   return this.props.removeBullet(this.props.id);
    // }

    if (Math.abs(actualXPos) >= MAX_X || Math.abs(actualYPos) >= MAX_Y) {
      DELETE_MESSAGE("OUT OF BOUNDS");

      this.props.removeBullet(this.props.id);
    }
  }

  componentWillUnmount() {
    this.xyTranslate.removeAllListeners();
  }
  
  componentDidMount() {
    this.animate();
  }

  calculateDuration = (startXY, endXY, speed = 0.2) => {
    const { x: startX = 0, y: startY = 0 } = startXY;
    const { x: endX = 0, y: endY = 0 } = endXY;

    return distance([startX, startY], [endX, endY]) / speed;
  }

  animate = () => {
    const duration = this.calculateDuration({
      x: this.props.fromX,
      y: this.props.fromY
    }, {
      x: this.state.toX,
      y: this.state.toY
    });

    // console.log("ANIMATE:", {
    //   id: this.props.id,
    //   fromX: this.props.fromX,
    //   fromY: this.props.fromY,
    //   toX: this.state.toX,
    //   toY: this.state.toY,
    //   duration,
    // })
    
    Animated.timing(this.xyTranslate, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  shouldComponentUpdate = () => false
  
  render() {
    const translateX = this.xyTranslate.x.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.fromX, this.state.toX],
    });

    const translateY = this.xyTranslate.y.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.fromY, this.state.toY],
    });

    // console.log("render:", {
    //   id: this.props.id,
    //   fromX: this.props.fromX,
    //   fromY: this.props.fromY,
    //   toX: this.state.toX,
    //   toY: this.state.toY,
    //   translateX,
    //   translateY,
    // })

    const translateStyle = { transform: [{ translateX }, { translateY }] };

    return (
      <Animated.View
        style={[
          styles.outer,
          translateStyle,
        ]}
      >
        <View style={styles.inner}>
          <View style={styles.hitbox} />
        </View>
      </Animated.View>
    );
  }
}
