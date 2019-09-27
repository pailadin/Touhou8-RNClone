import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Audio } from "expo-av";
import { isString, get } from "lodash";

const MUSIC_FILE = PropTypes.number; // yes really

export default class Music extends PureComponent {
  static propTypes = {
    trackIndex: PropTypes.number,
    tracks: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        intro: MUSIC_FILE,
        loop: MUSIC_FILE.isRequired,
      }),
      MUSIC_FILE,
    ])).isRequired,
  }

  static defaultProps = {
    trackIndex: 0,
  }

  introSoundObject = null;
  loopSoundObject = null;

  playTrack = track => {
    try {
      track.playAsync();

      return true;
      
    } catch(e) {
      return false;
    }
  }

  stopTrack = track => {
    try {
      track.unloadAsync();

      return true;

    } catch(e) {
      return false;
    }
  }

  componentDidMount() {
    this.initializeMusic();
  }

  componentDidUpdate(prevProps) {
    if (this.props.trackIndex !== prevProps.trackIndex) {
      this.stopTrack(this.loopSoundObject);
      this.stopTrack(this.introSoundObject);

      this.initializeMusic()
    }
  }

  getCurrentTracks = ({ tracks, trackIndex }) => {
    const currentTracks = get(tracks, trackIndex, {});

    if (isString(currentTracks)) {
      return { intro: null, loop: currentTracks };
    }

    return {
      intro: get(currentTracks, "intro", null),
      loop: get(currentTracks, "loop", null),
    };
  }

  initializeMusic = async () => {
    const { loop, intro } = this.getCurrentTracks(this.props);

    if (intro) {
      this.introSoundObject = (await Audio.Sound.createAsync(intro, {
        shouldPlay: true
      }, this.introPlaybackStatusUpdated)).sound;
    } else {
      this.introSoundObject = null;
    }

    this.loopSoundObject = (await Audio.Sound.createAsync(loop, {
      isLooping: true,
      shouldPlay: !intro
    })).sound;
  }

  componentWillUnmount() {
    this.stopTrack(this.loopSoundObject);
    this.stopTrack(this.introSoundObject);
  }

  introPlaybackStatusUpdated = ({ didJustFinish }) => {
    if (didJustFinish) {
      this.playTrack(this.loopSoundObject);
      this.stopTrack(this.introSoundObject);
    }
  }

  render() {
    return null
  }
}
