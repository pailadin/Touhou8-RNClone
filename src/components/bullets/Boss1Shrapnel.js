import React, { PureComponent } from "react";

import Bullet from "#/bullets/_Bullet";
import DEFAULT_BULLET_SIZE from "~/constants/bulletDefaultSizes";

export default class Boss1Shrapnel extends PureComponent {
  render() {
    return (
      <Bullet
        outerColor={"cyan"}
        outerSize={DEFAULT_BULLET_SIZE.outer * 0.5}
        innerSize={DEFAULT_BULLET_SIZE.inner * 0.5}
        hitboxSize={DEFAULT_BULLET_SIZE.hitbox * 0.5}
        {...this.props}
      />
    )
  }
}
