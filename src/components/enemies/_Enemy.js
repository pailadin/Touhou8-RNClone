import React, { PureComponent } from "react"
import { Animated, Button, Easing, Image, PanResponder, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { vh } from "react-native-expo-viewport-units";
import _ from "lodash";

import { MAX_Y } from "~/constants/dimensions";
import ENEMY_AI_ACTIONS from "~/constants/enemyAiActions";
import { calculateDuration } from "~/utils/pathing";
import DEFAULT_IMAGE from "$/sprites/EnemyBlue.png";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  image: {
    position: "absolute",
    aspectRatio: 2,
    transform: ([{ scaleX: 1.5 }, { scaleY: 1.5 }]),
  },
});

export default class Enemy extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    aiRoutines: PropTypes.array.isRequired,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
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
    initialX: 0,
    initialY: -MAX_Y,
    aiRoutines: [],
    outerColor: "blue",
    innerColor: "white",
    hitboxColor: "transparent",
  }

  constructor(props) {
    super(props);

    this.xyTranslate = new Animated.ValueXY();

    this.state = {
      aiIndex: -1,
      fromX: props.initialX,
      fromY: props.initialY,
      toX: props.initialX,
      toY: props.initialY,
      speed: undefined,
    };
  }

  componentWillUnmount() {
    this.xyTranslate.removeAllListeners();

    if (this.wait) {
      clearTimeout(this.wait);
    }
  }

  componentDidMount() {
    this.startNextAiRoutine();
  }

  startNextAiRoutine = () => {
    let { aiIndex } = this.state;

    if (++aiIndex < this.props.aiRoutines.length) {
      this.setState({ aiIndex });

      if (_.isFunction(this.props.aiRoutines[aiIndex])) {
        this.props.aiRoutines[aiIndex](this.startNextAiRoutine, {
          ...this.state,
        });

      } else {
        const [action, details] = this.props.aiRoutines[aiIndex];

        if (action === ENEMY_AI_ACTIONS.move) {
          this.move(details);
        } else if (action === ENEMY_AI_ACTIONS.wait) {
          this.wait(details);
        } else {
          this.props.despawn(this.props.id); // Just in case
        }
      }
    } else {
      this.props.despawn(this.props.id);
    }
  }

  move = ({
    fromX = this.state.toX,
    fromY = this.state.toY,
    toX,
    toY,
    speed = 0.2,
    config = {}
  }) => {
    this.xyTranslate = new Animated.ValueXY(); // otherwise the XY will "jump" with the second translate

    this.setState({ fromX, fromY, toX, toY, speed }, () => {
      const duration = calculateDuration({
        x: this.state.fromX,
        y: this.state.fromY,
      }, {
        x: this.state.toX,
        y: this.state.toY,
      }, speed);

      Animated.timing(this.xyTranslate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
        ...config,
      }).start(() => this.startNextAiRoutine());
    });
  }

  wait = (ms = 1000) => {
    this.wait = setTimeout(() => this.startNextAiRoutine(), ms);
  }

  render() {
    const translateX = this.xyTranslate.x.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.fromX, this.state.toX],
    });

    const translateY = this.xyTranslate.y.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.fromY, this.state.toY],
    });

    const translateStyle = { transform: [{ translateX }, { translateY }] };

    return (
      <Animated.View
        style={[
          styles.container,
          translateStyle,
        ]}
      >
        <Image source={DEFAULT_IMAGE} style={styles.image} resizeMode={"contain"} />
      </Animated.View>
    );
  }
}
