import React, { PureComponent } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import Player from "#/Player";
import BulletController from "~/controllers/BulletController";
import EnemyController from "~/controllers/EnemyController";
import { PLAY_AREA_HEIGHT_VH, PLAY_AREA_WIDTH_VW, MAX_X, MAX_Y, MAX_X_PLAYER, MAX_Y_PLAYER, PLAYER_HITBOX_SIZE } from "~/constants/dimensions";
import STAGE_BACKGROUND_IMAGE from "$/backgrounds/stage1.png";
import BOSS_BACKGROUND_IMAGE from "$/backgrounds/boss1PortraitGimped.png";
import STAGE_INTRO from "$/music/th08_02-intro.mp3";
import STAGE_LOOP from "$/music/th08_02-loop.mp3";
import BOSS_INTRO from "$/music/th08_03-intro.mp3";
import BOSS_LOOP from "$/music/th08_03-loop.mp3";

const PLAY_AREA_BORDER_WIDTH = 5;

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
    borderWidth: PLAY_AREA_BORDER_WIDTH,
    height: vh(PLAY_AREA_HEIGHT_VH),
    width: vw(PLAY_AREA_WIDTH_VW),
    position: "absolute",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    height: vh(PLAY_AREA_HEIGHT_VH) - PLAY_AREA_BORDER_WIDTH,
    width: vw(PLAY_AREA_WIDTH_VW) - PLAY_AREA_BORDER_WIDTH,
    position: "absolute",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default class GameScreen extends PureComponent {
  state = {
    musicTrackIndex: 0,
    backgroundImage: STAGE_BACKGROUND_IMAGE,
  }

  componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.loadTracks(STAGE_LOOP, STAGE_INTRO);
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  changeMusicAndBackground = (i = this.state.musicTrackIndex) => {
    if (i === 1) {
      this.props.screenProps.loadTracks(BOSS_LOOP, BOSS_INTRO);
      this.setState({ backgroundImage: BOSS_BACKGROUND_IMAGE });

    } else {
      i = 0;
      this.props.screenProps.loadTracks(STAGE_LOOP, STAGE_INTRO);
      this.setState({ backgroundImage: STAGE_BACKGROUND_IMAGE });
    }

    this.setState({ musicTrackIndex: i });
  }

  startBossMusic = () => this.changeMusicAndBackground(1);

  render() {
    return (
      <View style={styles.container}>
        <Player
          updatePlayerLocation={this.updatePlayerLocation}
          render={playerState => (
            <View style={styles.playarea}>
              <ImageBackground source={this.state.backgroundImage} style={styles.backgroundImage} imageStyle={{ opacity: 0.3 }}>

              <BulletController {...playerState} render={({spawnBullet}) => (
                <EnemyController {...playerState} spawnBullet={spawnBullet} startBossMusic={this.startBossMusic} />
              )}/>

              </ImageBackground>
            </View >
          )}
        />
      </View>
    )
  }
}
