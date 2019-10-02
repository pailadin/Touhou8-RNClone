import React, { PureComponent } from "react";
import Bullet from "#/bullets/_Bullet";
import SPECIAL_XY_VALUES from "~/constants/bulletSpecialXYValues";
import { MAX_Y } from "~/constants/dimensions";

export default class AimedAtBottomBullet extends PureComponent {
  render() {
    return (
      <Bullet
        toX={SPECIAL_XY_VALUES.random}
        toY={MAX_Y}
        {...this.props}
      />
    )
  }
}
