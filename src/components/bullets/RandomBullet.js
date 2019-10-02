import React, { PureComponent } from "react";
import Bullet from "#/bullets/_Bullet";
import SPECIAL_XY_VALUES from "~/constants/bulletSpecialXYValues";

export default class RandomBullet extends PureComponent {
  render() {
    return (
      <Bullet
        toX={SPECIAL_XY_VALUES.random}
        toY={SPECIAL_XY_VALUES.random}
        {...this.props}
      />
    )
  }
}
