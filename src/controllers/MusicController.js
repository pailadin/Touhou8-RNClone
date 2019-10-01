import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Audio } from "expo-av";

const MUSIC_FILE = PropTypes.number; // yes really

export default class MusicController extends PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
  }

  static defaultProps = {
    render: () => null
  }

  introTrackObject = null;
  loopTrackObject = null;

  playTrack = async trackObject => {
    await this.stopTrack();
    
    if (!trackObject) {
      return true;
    }

    try {
      await trackObject.playAsync();

      return true;
      
    } catch(e) {
      return false;
    }
  }

  stopTrack = async trackObject => {
    if (!trackObject) {
      return true;
    }

    try {
      await trackObject.unloadAsync();

      return true;

    } catch(e) {
      return false;
    }
  }

  loadTracks = async (loop, intro = null) => {
    await this.stopTracks();

    if (intro) {
      this.introTrackObject = (await Audio.Sound.createAsync(intro, {
        shouldPlay: true
      }, this.introPlaybackStatusUpdated)).sound;
    } else {
      this.introTrackObject = null;
    }

    this.loopTrackObject = (await Audio.Sound.createAsync(loop, {
      isLooping: true,
      shouldPlay: !intro
    })).sound;
  }

  stopTracks = async () => {
    await this.stopTrack(this.loopTrackObject);
    await this.stopTrack(this.introTrackObject);
  }

  componentWillUnmount() {
    this.stopTracks();
  }

  introPlaybackStatusUpdated = async ({ didJustFinish }) => {
    if (didJustFinish) {
      await this.playTrack(this.loopTrackObject);
      await this.stopTrack(this.introTrackObject);
    }
  }

  render() {
    return this.props.render({
      loadTracks: this.loadTracks,
      stopTracks: this.stopTracks,
    });
  }
}
