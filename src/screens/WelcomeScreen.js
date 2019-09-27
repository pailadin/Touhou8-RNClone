import React, { PureComponent } from "react";
import { Button, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default class WelcomeScreen extends PureComponent {
  handleStartPress = () => {
    this.props.navigation.navigate("Game", {
      // itemId: 86,
      // otherParam: "anything you want here",
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="START"
          onPress={this.handleStartPress}
        />
      </View>
    )
  }
}
