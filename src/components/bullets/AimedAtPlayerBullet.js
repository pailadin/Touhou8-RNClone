import React, { PureComponent } from "react";
import Bullet from "#/bullets/_Bullet";
import SPECIAL_XY_VALUES from "~/constants/bulletSpecialXYValues";

export default class AimedAtPlayerBullet extends PureComponent {
  render() {
    console.log("SPECIAL_XY_VALUES:", SPECIAL_XY_VALUES);

    return (
      <Bullet
        toX={SPECIAL_XY_VALUES.player}
        toY={SPECIAL_XY_VALUES.player}
        {...this.props}
      />
    )
  }
}
