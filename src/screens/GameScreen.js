import React, { PureComponent } from "react";
import { Button, Text, View } from "react-native";

import Music from "#/Music";
const STAGE_INTRO = require("$/music/th08_02-intro.mp3")
const STAGE_LOOP = require("$/music/th08_02-loop.mp3")
const BOSS_INTRO = require("$/music/th08_03-intro.mp3")
const BOSS_LOOP = require("$/music/th08_03-loop.mp3")

export default class GameScreen extends PureComponent {
  state = {
    i: 0,
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Change track"
          onPress={() => { this.setState({ i: this.state.i === 0 ? 1 : 0 }) }}
        />

        <Music
          trackIndex={this.state.i}
          tracks={[
            { intro: STAGE_INTRO, loop: STAGE_LOOP },
            { intro: BOSS_INTRO, loop: BOSS_LOOP },
          ]}
        />
      </View>
    )
  }
}
