import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { vh, vw } from "react-native-expo-viewport-units";

import Enemy from "#/enemies/_Enemy";
import SPRITE from "$/sprites/Boss1.png";
import BULLET_TYPES from "~/constants/bulletTypes"
import { MAX_X, MAX_Y } from "~/constants/dimensions";
import ENEMY_AI_ACTIONS from "~/constants/enemyAiActions";
import { getRandomX, getRandomY, getRandomXOffset, getRandomXOffsetAbs, getRandomYOffset } from "~/utils/xy";

export default class Boss1 extends PureComponent {
  static propTypes = {
    initialX: PropTypes.number.isRequired,
    spawnBullet: PropTypes.func.isRequired,
    goRight: PropTypes.bool,
  }

  getXYForSideShots = ({ x, y, playerX, playerY }, enemyXOffset = 0, playerXOffset = 0) => ({
    fromX: x + vw(enemyXOffset),
    fromY: y,
    toX: playerX + vw(playerXOffset),
    toY: playerY,
    speed: 0.2,
  })

  getXYForAimedShots = ({ x, y, playerX, playerY }, enemyOffset = 0, playerOffset = 0) => ({
    fromX: x + vw(enemyOffset),
    fromY: y + vw(enemyOffset),
    toX: playerX + vw(playerOffset),
    toY: playerY + vw(playerOffset),
    speed: 0.3,
  })

  getXYForShrapnel = ({ x, y }) => ({
    fromX: x,
    fromY: y,
    toX: getRandomX(),
    toY: getRandomY(),
    speed: 0.1,
  })

  shootGreenSideShots = (next, props) => {
    this.props.spawnBullet([
      { ...this.getXYForSideShots(props) },
      { ...this.getXYForSideShots(props, -10, 10) },
      { ...this.getXYForSideShots(props, -20, 17.5) },
      { ...this.getXYForSideShots(props, -30, 25) },
      { ...this.getXYForSideShots(props, -10, -10) },
      { ...this.getXYForSideShots(props, -20, -17.5) },
      { ...this.getXYForSideShots(props, -30, -25) },
    ].map(config => ({
      ...config,
      type: BULLET_TYPES.boss1SideShots,
      useYellowBullet: false,
    })));

    next();
  }

  shootYellowSideShots = (next, props) => {
    this.props.spawnBullet([
      { ...this.getXYForSideShots(props) },
      { ...this.getXYForSideShots(props, 10, 10) },
      { ...this.getXYForSideShots(props, 20, 17.5) },
      { ...this.getXYForSideShots(props, 30, 25) },
      { ...this.getXYForSideShots(props, 10, -10) },
      { ...this.getXYForSideShots(props, 20, -17.5) },
      { ...this.getXYForSideShots(props, 30, -25) },
    ].map(config => ({
      ...config,
      type: BULLET_TYPES.boss1SideShots,
      useYellowBullet: true,
    })));

    next();
  }

  shootAimedYellowShots = (next, props) => {
    this.props.spawnBullet([
      { ...this.getXYForAimedShots(props) },
      { ...this.getXYForAimedShots(props, 10, 30) },
      { ...this.getXYForAimedShots(props, 10, -30) },
    ].map(config => ({
      ...config,
      type: BULLET_TYPES.boss1AimedShots,
    })));

    next();
  }

  getExplosionData = (amount = 5) => {
    const x = getRandomX();
    const y = -Math.random() * MAX_Y;

    return Array(amount).fill().map(_ => ({
      ...this.getXYForShrapnel({ x,y }),
      type: BULLET_TYPES.boss1Shrapnel,
    }));
  }

  spawnExplosions = (amount) => next => {
    this.props.spawnBullet([
      ...this.getExplosionData(amount),
      ...this.getExplosionData(amount),
      ...this.getExplosionData(amount),
    ]);

    next();
  }

  genericPerformActionsWithDelayRoutine = (func, amount = 3, delay = 500) => {
    let routine = [];

    for (let i = 0; i < amount; i++) {
      if (delay > 0 && routine.length > 0) {
        routine.push([ENEMY_AI_ACTIONS.wait, delay]);
      }

      routine.push(func);
    }

    return routine;
  }

  getShootGreenSideShotsRoutine = (amount = 3, delay = 500) => [
    this.getRandomMove(),
    ...this.genericPerformActionsWithDelayRoutine(this.shootGreenSideShots, amount, delay),
  ]

  getShootYellowSideShotsRoutine = (amount = 3, delay = 500) => [
    this.getRandomMove(),
    ...this.genericPerformActionsWithDelayRoutine(this.shootYellowSideShots, amount, delay),
  ]

  getShootAimedYellowShotsRoutine = (amount = 5, delay = 100) => [
    this.getRandomMove(),
    ...this.genericPerformActionsWithDelayRoutine(this.shootAimedYellowShots, amount, delay),
  ]

  getRandomMove = () => [ENEMY_AI_ACTIONS.move, {
    toX: getRandomXOffset(50),
    toY: -((Math.random() * (MAX_Y * 0.3)) + (MAX_Y * 0.2)),
    speed: 0.3,
  }]

  render() {
    const {
      initialX,
      ...rest
    } = this.props;

    const aiRoutines = [
      [ENEMY_AI_ACTIONS.move, {
        toY: -MAX_X/2,
      }],

      ...this.getShootGreenSideShotsRoutine(),
      [ENEMY_AI_ACTIONS.wait, 500],
      ...this.getShootYellowSideShotsRoutine(),

      [ENEMY_AI_ACTIONS.wait, 750],

      ...this.getShootAimedYellowShotsRoutine(),
      [ENEMY_AI_ACTIONS.wait, 1000],
      ...this.getShootAimedYellowShotsRoutine(),
      [ENEMY_AI_ACTIONS.wait, 1000],
      this.spawnExplosions(),
      [ENEMY_AI_ACTIONS.wait, 500],
      ...this.getShootAimedYellowShotsRoutine(),

      [ENEMY_AI_ACTIONS.wait, 1000],

      [ENEMY_AI_ACTIONS.gotoAction, 1],

      // Will never reach this point:
      [ENEMY_AI_ACTIONS.move, {
        toY: -MAX_Y,
      }],
    ];

    return <Enemy {...rest} initialX={initialX} aiRoutines={aiRoutines} sprite={SPRITE} />;
  }
}
