import React, { PureComponent } from "react";
import { Button, StyleSheet, View } from "react-native";

import STAGE_INTRO from "$/music/th08_02-intro.mp3";
import STAGE_LOOP from "$/music/th08_02-loop.mp3";
import BOSS_INTRO from "$/music/th08_03-intro.mp3";
import BOSS_LOOP from "$/music/th08_03-loop.mp3";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default class GameScreen extends PureComponent {
  state = {
    testMusic: 0,
  }

  componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.loadTracks(STAGE_LOOP, STAGE_INTRO);
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  toggleMusicTest = () => {
    const i = !this.state.testMusic * 1;

    if (i === 1) {
      this.props.screenProps.loadTracks(BOSS_LOOP, BOSS_INTRO);
    } else {
      this.props.screenProps.loadTracks(STAGE_LOOP, STAGE_INTRO);
    }

    this.setState({ testMusic: i });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Change track"
          onPress={this.toggleMusicTest}
        />

        {/* <Music
          trackIndex={this.state.i}
          tracks={[
            { intro: STAGE_INTRO, loop: STAGE_LOOP },
            { intro: BOSS_INTRO, loop: BOSS_LOOP },
          ]}
        /> */}
      </View>
    )
  }
}
