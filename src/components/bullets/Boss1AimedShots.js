import React, { PureComponent } from "react";

import Bullet from "#/bullets/_Bullet";

export default class Boss1AimedShots extends PureComponent {
  render() {
    return (
      <Bullet
        outerColor={"yellow"}
        {...this.props}
      />
    )
  }
}
