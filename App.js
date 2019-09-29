import React, { PureComponent } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import MusicController from "~/controllers/MusicController";
import WelcomeScreen from "~/screens/WelcomeScreen";
import GameScreen from "~/screens/GameScreen";

const RootStack = createStackNavigator({
  Home: {
    screen: WelcomeScreen,
  },
  Game: {
    screen: GameScreen,
    navigationOptions: {
      title: "Game",
      headerLeft: null,
    },
  },
}, {
  headerMode: "none",
  navigationOptions: {
    headerVisible: false,
  },
  initialRouteName: "Home"
});

const AppContainer = createAppContainer(RootStack);

export default class App extends PureComponent {
  render() {
    return (
      <MusicController render={({ loadTracks}) => (
        <AppContainer screenProps={{ loadTracks }}/>
      )} />
    );
  }
}