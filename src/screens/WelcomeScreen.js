import React, { PureComponent } from "react";
import { Button, ImageBackground, StyleSheet, View } from "react-native";

import MENU_IMAGE from "$/ui/menu.png";
import MENU_MUSIC from "$/music/th08_01.mp3";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black", // should NOT show
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default class WelcomeScreen extends PureComponent {
  handleStartPress = () => {
    this.props.navigation.navigate("Game", {});
  }

  componentWillMount() {
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.loadTracks(MENU_MUSIC);
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={MENU_IMAGE} style={styles.backgroundImage}>
          <Button title="START" onPress={this.handleStartPress} raised large />
        </ImageBackground>
      </View>
    )
  }
}
