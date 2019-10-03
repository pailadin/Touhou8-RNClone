import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import UniqueString from "uuid/v1";

import Bullets from "#/bullets/";
import BULLET_TYPES from "~/constants/bulletTypes"

export default class BulletController extends PureComponent {
  static propTypes = {
    playerX: PropTypes.number.isRequired,
    playerY: PropTypes.number.isRequired,
    playerLeft: PropTypes.number.isRequired,
    playerRight: PropTypes.number.isRequired,
    playerTop: PropTypes.number.isRequired,
    playerBottom: PropTypes.number.isRequired,
  }

  state = { bullets: [] }

  spawn = (newBullets = []) => {
    this.setState({ bullets: [ ...this.state.bullets, ...[].concat(newBullets).map(({
      type = BULLET_TYPES.random,
      ...rest
    }) => ({ key: UniqueString(), type, ...rest }))]});
  }

  despawn = i => {
    const indexToRemove = this.state.bullets.findIndex(x => x.key === i);
    if (indexToRemove >= 0) {
      this.setState({ bullets: [
        ...this.state.bullets.slice(0, indexToRemove),
        ...this.state.bullets.slice(indexToRemove + 1),
      ]})
    }
  }

  renderBullets = () => {
    return this.state.bullets.map(({ key, type, ...rest }) => {
      const Component = get(Bullets, type, Bullets[BULLET_TYPES.random]);

      return (
        <Component
          key={key}
          id={key}
          {...rest}
          despawn={this.despawn}
          playerX={this.props.playerX}
          playerY={this.props.playerY}
          playerLeft={this.props.playerLeft}
          playerRight={this.props.playerRight}
          playerTop={this.props.playerTop}
          playerBottom={this.props.playerBottom}
        />
      );
    });
  }

  render() {
    return (
      <>
        {this.renderBullets()}

        {this.props.render && this.props.render({
          ...this.props,
          spawnBullet: this.spawn,
        })}
      </>
    )
  }
}
