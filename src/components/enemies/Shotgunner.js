import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { vh, vw } from "react-native-expo-viewport-units";

import Enemy from "#/enemies/_Enemy";
import SPRITE from "$/sprites/EnemyGreenHat.png";
import BULLET_TYPES from "~/constants/bulletTypes"
import { MAX_X, MAX_Y } from "~/constants/dimensions";
import ENEMY_AI_ACTIONS from "~/constants/enemyAiActions";

export default class Shotgunner extends PureComponent {
  static propTypes = {
    initialX: PropTypes.number.isRequired,
    spawnBullet: PropTypes.func.isRequired,
    useRedBullets: PropTypes.bool,
  }

  static defaultProps = {
    useRedBullets: true,
  }

  shootAround = (next, { x, y }) => {
    const config = { type: BULLET_TYPES.shotgunnerAround, fromX: x, fromY: y, useRedBullets: this.props.useRedBullets };
    this.props.spawnBullet({ ...config, toX: -MAX_X, toY: y });
    this.props.spawnBullet({ ...config, toX: MAX_X, toY: y });
    this.props.spawnBullet({ ...config, toX: x, toY: MAX_Y });
    this.props.spawnBullet({ ...config, toX: x, toY: -MAX_Y });

    this.props.spawnBullet({ ...config, toX: x + 32, toY: y + 32 });
    this.props.spawnBullet({ ...config, toX: x - 32, toY: y + 32 });
    this.props.spawnBullet({ ...config, toX: x + 32, toY: y - 32 });
    this.props.spawnBullet({ ...config, toX: x - 32, toY: y - 32 });

    next();
  }

  getXYForShootingAtPlayer = ({ x, y, playerX, playerY }, offset = 0) => ({
    fromX: x,
    fromY: y,
    toX: playerX + vw(offset),
    toY: playerY,
  })

  shootAtPlayer = (next, props) => {
    const config= { type: BULLET_TYPES.shotgunnerAimed, useRedBullets: this.props.useRedBullets };

    this.props.spawnBullet({ ...config, ...this.getXYForShootingAtPlayer(props) });
    this.props.spawnBullet({ ...config, ...this.getXYForShootingAtPlayer(props, 10) });
    this.props.spawnBullet({ ...config, ...this.getXYForShootingAtPlayer(props, -10) });

    next();
  }

  getShootAtPlayerXTimesRoutine = (amount = 3, delay = 500) => {
    let routine = [];

    for (let i = 0; i < amount; i++) {
      if (delay > 0 && routine.length > 0) {
        routine.push([ENEMY_AI_ACTIONS.wait, delay]);
      }

      routine.push(this.shootAtPlayer);
    }

    return routine;
  }

  render() {
    const {
      initialX,
      ...rest
    } = this.props;

    const aiRoutines = [
      [ENEMY_AI_ACTIONS.move, {
        toY: -MAX_Y * 0.2,
      }],
      this.shootAround,
      [ENEMY_AI_ACTIONS.wait, 200],
      ...this.getShootAtPlayerXTimesRoutine(3),
      [ENEMY_AI_ACTIONS.move, {
        toX: initialX > 0 ? MAX_X : MAX_Y,
      }]
    ];

    return <Enemy {...rest} initialX={initialX} aiRoutines={aiRoutines} sprite={SPRITE} />;
  }
}
