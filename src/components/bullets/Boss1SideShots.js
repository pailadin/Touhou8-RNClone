import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Bullet from "#/bullets/_Bullet";
import DEFAULT_BULLET_SIZE from "~/constants/bulletDefaultSizes";

export default class Boss1SideShots extends PureComponent {
  static propTypes = {
    useYellowBullet: PropTypes.bool,
  }

  static defaultProps = {
    useYellowBullet: true,
  }

  render() {
    return (
      <Bullet
        outerColor={this.props.useYellowBullet ? "yellow" : "green" }
        {...this.props}
      />
    )
  }
}
