import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { isMobile } from "react-device-detect";
import ReactPlayer from "react-player";

export interface Props {
  youtubeUrl: string;
}

export interface State {
  showYoutubePlayer: boolean;
}

export class EmbeddedVideoPlayer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // this.state = {
    //   showYoutubePlayer: false,
    // };
  }

  componentDidMount() {
    // this.pressPlaybackButton = this.pressPlaybackButton.bind(this);
  }

  // pressPlaybackButton() {
  //   this.setState({
  //     showYoutubePlayer: !this.state.showYoutubePlayer,
  //   });
  // }

  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#A2A2A2",
        }}
        // onPress={this.pressPlaybackButton}
      >
        {/* {!this.state.showYoutubePlayer && (
          <Image
            resizeMode="contain"
            source={require("../../assets/play_button.png")}
            style={{
              width: isMobile ? 8 : 30,
              height: isMobile ? 13 : 60,
            }}
          ></Image>
        )} */}
        {/* {this.state.showYoutubePlayer && ( */}
          <ReactPlayer
            controls={true}
            url={this.props.youtubeUrl}
            className="react-player"
            width="100%"
            height="100%"
            // onPause={this.pressPlaybackButton}
          ></ReactPlayer>
        {/* )} */}
      </TouchableOpacity>
    );
  }
}
