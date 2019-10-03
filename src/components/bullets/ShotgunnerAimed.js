import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Bullet from "#/bullets/_Bullet";
import DEFAULT_BULLET_SIZE from "~/constants/bulletDefaultSizes";

export default class ShotgunnerAimed extends PureComponent {
  static propTypes = {
    useRedBullet: PropTypes.bool,
  }

  static defaultProps = {
    useRedBullet: true,
  }

  render() {
    return (
      <Bullet
        {...(this.props.useRedBullet ? { outerColor: "red" } : {})}
        outerSize={DEFAULT_BULLET_SIZE.outer * 1.2}
        innerSize={DEFAULT_BULLET_SIZE.inner * 1.2}
        hitboxSize={DEFAULT_BULLET_SIZE.hitbox * 1.2}
        {...this.props}
      />
    )
  }
}
