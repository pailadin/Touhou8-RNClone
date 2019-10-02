import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Enemy from "#/enemies/_Enemy";
import BULLET_TYPES from "~/constants/bulletTypes"
import { MAX_X, MAX_Y } from "~/constants/dimensions";
import ENEMY_AI_ACTIONS from "~/constants/enemyAiActions";
import { getRandomXOffset, getRandomXOffsetAbs, getRandomYOffset } from "~/utils/xy";

export default class Dropper extends PureComponent {
  static propTypes = {
    initialX: PropTypes.number.isRequired,
    spawnBullet: PropTypes.func.isRequired,
    goRight: PropTypes.bool,
  }

  shootAtPlayer = (next, { toX, toY }) => {
    this.props.spawnBullet({ type: BULLET_TYPES.aimedAtPlayer, fromX: toX, fromY: toY });
    next();
  }

  render() {
    const {
      initialX,
      goRight = initialX <= 0,
      ...rest
    } = this.props;

    const aiRoutines = [
      [ENEMY_AI_ACTIONS.move, {
        toX: initialX + getRandomXOffsetAbs(10, 30) * (goRight ? 1 : 0),
        toY: 0 + getRandomYOffset(),
      }],
      this.shootAtPlayer,
      // [ENEMY_AI_ACTIONS.wait, 100],
      [ENEMY_AI_ACTIONS.move, {
        toX: initialX + getRandomXOffset(),
        toY: -MAX_Y,
      }]
    ];

    return <Enemy {...rest} initialX={initialX} aiRoutines={aiRoutines} />;
  }
}
