import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import UniqueString from "uuid/v1";
import { isFinite as isNumber } from "lodash";

import StageData from "~/stageData/stage01";
import { Dropper as DEFAULT_ENEMY } from "#/enemies"

export default class EnemyController extends PureComponent {
  static propTypes = {
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
    spawnBullet: PropTypes.func.isRequired,
    startBossMusic: PropTypes.func.isRequired,
  }

  state = {
    enemies: []
  }

  componentDidMount() {
    this.readStageData();

    if (this.waitTimeout) {
      clearTimeout(this.wait);
    }
  }

  readStageData = (i = 0) => {
    if (i < StageData.length) {
      const currentRow = StageData[i];

      if (isNumber(currentRow)) {
        this.waitTimeout = setTimeout(() => this.readStageData(i + 1), currentRow);

      } else {
        this.spawn([currentRow]);
        this.readStageData(i + 1);
      }

    } else {
      this.setState({ stageDataIndex: i });

      this.props.startBossMusic();
    }
  }

  spawn = (newEnemies = []) => {
    this.setState({ enemies: [ ...this.state.enemies, ...[].concat(newEnemies).map(({
      Component = DEFAULT_ENEMY,
      ...rest
    }) => ({ key: UniqueString(), Component, ...rest }))]});
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
