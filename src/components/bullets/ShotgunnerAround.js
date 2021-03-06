import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Bullet from "#/bullets/_Bullet";
import DEFAULT_BULLET_SIZE from "~/constants/bulletDefaultSizes";

export default class ShotgunnerAround extends PureComponent {
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
        outerSize={DEFAULT_BULLET_SIZE.outer * 1.5}
        innerSize={DEFAULT_BULLET_SIZE.inner * 1.5}
        hitboxSize={DEFAULT_BULLET_SIZE.hitbox * 1.5}
        speed={0.1}
        {...this.props}
      />
    )
  }
}
