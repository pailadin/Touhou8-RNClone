import React, { PureComponent } from "react";
import { vw, vh } from "react-native-expo-viewport-units";
import PropTypes from "prop-types";

import Bullet from "#/bullets/_Bullet";
import { PLAY_AREA_HEIGHT_VH, PLAY_AREA_WIDTH_VW, MAX_X, MAX_Y, MAX_Y_PLAYER } from "~/constants/dimensions";

export default class BulletController extends PureComponent {
  static propTypes = {
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    const getRandomX = () => (Math.floor(Math.random() * MAX_X) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const getRandomY = () => (Math.floor(Math.random() * MAX_Y) + 1) * (Math.random() > 0.5 ? 1 : -1);

    const aimedAtPlayer = [...Array(5)].map((_, i) => ({
      key: `aimedAtPlayer${i}`,
      fromX: getRandomX(),
      fromY: getRandomY(),
      toX: "PLAYER",
      toY: "PLAYER",
    }));

    const aimedAtBottom = [...Array(5)].map((_, i) => ({
      key: `aimedAtBottom${i}`,
      fromX: getRandomX(),
      fromY: getRandomY(),
      toX: Math.random() * MAX_X,
      toY: MAX_Y,
    }));

    const randomlyAimed = [...Array(5)].map((_, i) => ({
      key: `randomlyAimed${i}`,
      fromX: getRandomX(),
      fromY: getRandomY(),
      toX: "RANDOM",
      toY: "RANDOM",
    }));

    this.state = { bullets: [
      ...aimedAtPlayer,
      ...aimedAtBottom,
      ...randomlyAimed,
    ] };
  }

  removeBullet = i => {
    const indexToRemove = this.state.bullets.findIndex(x => x.key === i);
    if (indexToRemove >= 0) {
      this.setState({ bullets: [
        ...this.state.bullets.slice(0, indexToRemove),
        ...this.state.bullets.slice(indexToRemove + 1),
      ]})
    }
  }

  renderBullets = () => {    
    return this.state.bullets.map(({ key, ...rest }) =>
      <Bullet
        key={key}
        id={key}
        {...rest}
        removeBullet={this.removeBullet}
        playerX={this.props.playerX}
        playerY={this.props.playerY}
        playerLeft={this.props.playerLeft}
        playerRight={this.props.playerRight}
        playerTop={this.props.playerTop}
        playerBottom={this.props.playerBottom}
      />
    )
  }

  render() {
    return (
      <>
        {this.renderBullets()}

        {this.props.render && this.props.render()}
      </>
    )
  }
}
