import React, { Component } from "react"
import { Animated, Button, Easing, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import _ from "lodash";
import { intersect, distance } from "mathjs"

import { MAX_X, MAX_Y, LONG_DIAGONAL_LENGTH } from "~/constants/dimensions";
import DEFAULT_BULLET_SIZE from "~/constants/bulletDefaultSizes";
import SPECIAL_XY_VALUES from "~/constants/bulletSpecialXYValues";
import { calculateDuration } from "~/utils/pathing";

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "blue",
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
  },
  inner: {
    backgroundColor: "white",
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3001,
  },
  hitbox: {
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 3002,
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
      toX = fromX;//getRandomX();
    }
  }

  if (!_.isFinite(toY)) {
    toY = String(toY);

    if (toY === SPECIAL_XY_VALUES.player) {
      toY = initialPlayerY;
    } else {
      toY = fromY;//getRandomY();
    }
  }

  // Find a point at the edge of the play area to aim the bullet at:
  const startingXY = [fromX, fromY];
  const endingXY = [toX, toY];
  const currentLineSegment = [startingXY, endingXY];
  let topIntersection, bottomIntersection, leftIntersection, rightIntersection;
  let topDistance, bottomDistance, leftDistance, rightDistance;

  if (toY > fromY) { // Going down?
    bottomIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, MAX_Y], [LONG_DIAGONAL_LENGTH, MAX_Y]);
    if (bottomIntersection) bottomDistance = distance(endingXY, bottomIntersection);

  } else if (toY < fromY) {
    topIntersection = intersect(...currentLineSegment, [-LONG_DIAGONAL_LENGTH, -MAX_Y], [LONG_DIAGONAL_LENGTH, -MAX_Y]);
    if (topIntersection) topDistance = distance(endingXY, topIntersection);
  }

  if (toX > fromX) { // Going right?
    rightIntersection = intersect(...currentLineSegment, [MAX_X, -LONG_DIAGONAL_LENGTH], [MAX_X, LONG_DIAGONAL_LENGTH]);
    if (rightIntersection) rightDistance = distance(endingXY, rightIntersection);

  } else if (toX < fromX) {
    leftIntersection = intersect(...currentLineSegment, [-MAX_X, -LONG_DIAGONAL_LENGTH], [-MAX_X, LONG_DIAGONAL_LENGTH]);
    if (leftIntersection) leftDistance = distance(endingXY, leftIntersection);
  }

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
    speed: PropTypes.number,
    outerColor: PropTypes.string,
    innerColor: PropTypes.string,
    hitboxColor: PropTypes.string,
    outerSize: PropTypes.number,
    innerSize: PropTypes.number,
    hitboxSize: PropTypes.number,
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
    innerSize: DEFAULT_BULLET_SIZE.inner,
    outerSize: DEFAULT_BULLET_SIZE.outer,
    hitboxSize: DEFAULT_BULLET_SIZE.hitbox,
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
    const { playerLeft, playerRight, playerTop, playerBottom, hitboxSize } = this.props;

    const halfHitboxSize = (hitboxSize / 2);
    const actualXPos = (x * MAX_X);
    const actualYPos = (y * MAX_Y);

    const BULLET_X_START = actualXPos - halfHitboxSize;
    const BULLET_X_END = actualXPos + halfHitboxSize;
    const BULLET_Y_START = actualYPos - halfHitboxSize;
    const BULLET_Y_END = actualYPos + halfHitboxSize;

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

  animate = () => {
    const duration = calculateDuration({
      x: this.props.fromX,
      y: this.props.fromY
    }, {
      x: this.state.toX,
      y: this.state.toY
    }, this.props.speed);

    Animated.timing(this.xyTranslate, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  shouldComponentUpdate = () => false

  getOuterStyles = (translateStyle = {}) => [
    styles.outer, translateStyle, {
      backgroundColor: this.props.outerColor,
      width: this.props.outerSize,
      height: this.props.outerSize,
      borderRadius: this.props.outerSize,
    }
  ]

  getInnerStyles = () => [
    styles.inner, {
      backgroundColor: this.props.innerColor,
      width: this.props.innerSize,
      height: this.props.innerSize,
      borderRadius: this.props.innerSize,
    }
  ]

  getHitboxStyles = () => [
    styles.hitbox, {
      backgroundColor: this.props.hitboxColor,
      width: this.props.hitboxSize,
      height: this.props.hitboxSize,
    }
  ]

  render() {
    const translateX = this.xyTranslate.x.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.fromX, this.state.toX],
    });

    const translateY = this.xyTranslate.y.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.fromY, this.state.toY],
    });

    return (
      <Animated.View style={this.getOuterStyles({ transform: [{ translateX }, { translateY } ] })}>
        <View style={this.getInnerStyles()}>
          <View style={this.getHitboxStyles()} />
        </View>
      </Animated.View>
    );
  }
}
