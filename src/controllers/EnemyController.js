import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import UniqueString from "uuid/v1";

import { MAX_X, MAX_Y, LONG_DIAGONAL_LENGTH } from "~/constants/dimensions";
import { Dropper } from "#/enemies";

export default class EnemyController extends PureComponent {
  static propTypes = {
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
    spawnBullet: PropTypes.func.isRequired,
  }

  state = { enemies: [
    { key: "aaa", Component: Dropper, initialX: MAX_X * -0.4 },
    { key: "bbb", Component: Dropper, initialX: MAX_X * -0.5 },
    { key: "ccc", Component: Dropper, initialX: MAX_X * -0.6 },
  ]}

  spawn = (newEnemies = []) => {
    this.setState({ bullets: [ ...this.state.bullets, ...[].concat(newEnemies).map(({
      Component = Dropper,
      ...rest
    }) => ({ key: UniqueString(), type, ...rest }))]});
  }

  despawn = key => {
    const indexToRemove = this.state.enemies.findIndex(x => x.key === key);
    if (indexToRemove >= 0) {
      this.setState({ enemies: [
        ...this.state.enemies.slice(0, indexToRemove),
        ...this.state.enemies.slice(indexToRemove + 1),
      ]})
    }
  }

  renderEnemies = () => {
    return this.state.enemies.map(({ key, Component, ...rest }) =>
      <Component
        key={key}
        id={key}
        {...rest}
        despawn={this.despawn}
        spawnBullet={this.props.spawnBullet}
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
        {this.renderEnemies()}

        {this.props.render && this.props.render()}
      </>
    )
  }
}
