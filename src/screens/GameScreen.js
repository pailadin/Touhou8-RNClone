import React, { PureComponent } from "react";
import { Button, StyleSheet, View } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import Player from "#/Player";
import BulletController from "~/controllers/BulletController";
import EnemyController from "~/controllers/EnemyController";
import { PLAY_AREA_HEIGHT_VH, PLAY_AREA_WIDTH_VW, MAX_X, MAX_Y, MAX_X_PLAYER, MAX_Y_PLAYER, PLAYER_HITBOX_SIZE } from "~/constants/dimensions";
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
  playarea: {
    backgroundColor: "#111111",
    borderColor: "white",
    borderWidth: 5,
    height: vh(PLAY_AREA_HEIGHT_VH),
    width: vw(PLAY_AREA_WIDTH_VW),
    position: "absolute",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default class GameScreen extends PureComponent {
  state = {
    //
    testMusic: 0,
    //
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
        <Player
          updatePlayerLocation={this.updatePlayerLocation}
          render={playerState => (
            <View style={styles.playarea}>
              {/* <Button
                title="Change track"
                onPress={this.toggleMusicTest}
              /> */}

              <BulletController {...playerState} render={({spawnBullet}) => (
                <EnemyController {...playerState} spawnBullet={spawnBullet} />
              )}/>
            </View>
          )}
        />
      </View>
    )
  }
}
