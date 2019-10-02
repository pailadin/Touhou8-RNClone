import React, { Component } from "react"
import { Animated, Button, Easing, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { vw, vh } from "react-native-expo-viewport-units";
import _ from "lodash";
import { intersect, distance } from "mathjs"

import { MAX_X, MAX_Y, LONG_DIAGONAL_LENGTH } from "~/constants/dimensions";
import SPECIAL_XY_VALUES from "~/constants/bulletSpecialXYValues";
import { getRandomX, getRandomY } from "~/utils/randomXY"

const INNER_RADIUS = vh(1.5);
const OUTER_RADIUS = INNER_RADIUS + vh(2);
const HITBOX_SIZE = vh(1.5);

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "blue",
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
    backgroundColor: "transparent",
    position: "absolute",
    width: HITBOX_SIZE,
    height: HITBOX_SIZE,
    zIndex: 1000,
  }
});

const calculateToXY = ({
  fromX,
  fromY,
  toX = SPECIAL_XY_VALUES.random,
  toY = SPECIAL_XY_VALUES.random,
  playerX: currentPlayerX,
  playerY: currentPlayerY
}, initialPlayerX = currentPlayerX, initialPlayerY = currentPlayerY) => {
  if (!_.isFinite(toX)) {
    toX = String(toX);

    if (toX === SPECIAL_XY_VALUES.player) {
      toX = initialPlayerX;
    } else {
      toX = getRandomX();
    }
  }

  if (!_.isFinite(toY)) {
    toY = String(toY);

    if (toY === SPECIAL_XY_VALUES.player) {
      toY = initialPlayerY;
    } else {
      toY = getRandomY();
    }
  }

  // Find a point at the edge of the play area to aim the bullet at:
  const startingXY = [fromX, fromY];
  const endingXY = [toX, toY];
  const currentLineSegment = [startingXY, endingXY];
  let topDistance, bottomDistance, leftDistance, rightDistance;

  const topIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, -MAX_Y], [LONG_DIAGONAL_LENGTH, -MAX_Y]);
  const bottomIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, MAX_Y], [LONG_DIAGONAL_LENGTH, MAX_Y]);
  const leftIntersection = intersect(...currentLineSegment, [-MAX_X, -LONG_DIAGONAL_LENGTH], [-MAX_X, LONG_DIAGONAL_LENGTH]);
  const rightIntersection = intersect(...currentLineSegment, [MAX_X, -LONG_DIAGONAL_LENGTH], [MAX_X, LONG_DIAGONAL_LENGTH]);

  if (topIntersection) topDistance = distance(endingXY, topIntersection);
  if (bottomIntersection) bottomDistance = distance(endingXY, bottomIntersection);
  if (leftIntersection) leftDistance = distance(endingXY, leftIntersection);
  if (rightIntersection) rightDistance = distance(endingXY, rightIntersection);

  const playerXY = _.get(
    _.sortBy([
      [topDistance, topIntersection],
      [bottomDistance, bottomIntersection],
      [leftDistance, leftIntersection],
      [rightDistance, rightIntersection],
    ].filter(x => x[0]), [x => x[0]]),
    "[0]",
    [null, [toX, toY]],
  );

  return { toX: playerXY[1][0], toY: playerXY[1][1] };
}

export default class Bullet extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    fromX: PropTypes.number,
    fromY: PropTypes.number,
    // If not aiming at the player, pass at least ONE point on an edge for best results:
    toX: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Reminder: Use state version of this:
    toY: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Reminder: Use state version of this.
    outerColor: PropTypes.string,
    innerColor: PropTypes.string,
    hitboxColor: PropTypes.string,
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
    despawn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fromX: 0,
    fromY: -MAX_Y,
    outerColor: "blue",
    innerColor: "white",
    hitboxColor: "transparent",
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

    // const DELETE_MESSAGE = (message = "COLLISION") => console.log(`${message}:`, {
    //   id: this.props.id,
    //   playerLeft,
    //   playerRight,
    //   playerTop,
    //   playerBottom,
    //   BULLET_X_START,
    //   BULLET_X_END,
    //   BULLET_Y_START,
    //   BULLET_Y_END,
    //   MAX_X,
    //   MAX_Y,
    // });

    // Should probably be disabled until we can find a way to make this work reliably:
    // if (!(
    //   (playerRight < BULLET_X_START) ||
    //   (playerLeft > BULLET_X_END) ||
    //   (playerTop > BULLET_Y_END) ||
    //   (playerBottom < BULLET_Y_START)
    // )) {
    //   DELETE_MESSAGE();

    //   return this.props.despawn(this.props.id);
    // }

    if (Math.abs(actualXPos) >= MAX_X || Math.abs(actualYPos) >= MAX_Y) {
      // DELETE_MESSAGE("OUT OF BOUNDS");

      this.props.despawn(this.props.id);
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
          { backgroundColor: this.props.outerColor }
        ]}
      >
        <View style={[styles.inner, { backgroundColor: this.props.innerColor }]}>
          <View style={[styles.hitbox, { backgroundColor: this.props.hitboxColor }]} />
        </View>
      </Animated.View>
    );
  }
}
