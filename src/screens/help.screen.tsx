import React, { Component } from "react";
import { View, Image } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { isMobile } from "react-device-detect";
import { Color } from "../pojo/color";
import ReactPlayer from "react-player";
import { SpacerScreenSegment } from "./spacer.screen.segment";

export class HelpScreen extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const currentWidowWidth = window.innerWidth;
    const currentWindowHeight = window.innerHeight;

    console.log(currentWindowHeight);

    this.setState({
      width: this.conformToMinWidth(currentWidowWidth),
      height: currentWindowHeight * 2,
    });
  }

  conformToMinWidth(currentWindowWidth: number) {
    const MAX_WINDOW_WIDTH = 800;

    let conformed = currentWindowWidth;
    if (currentWindowWidth > MAX_WINDOW_WIDTH) {
      conformed = MAX_WINDOW_WIDTH;
    }

    return conformed;
  }

  render() {
    return (
      <View
        style={{
          width: this.state.width,
          height: this.state.height,
          justifyContent: "space-around",
          alignContent: "stretch",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 0.42,
          }}
        ></View>
        <View
          style={{
            width: 50,
            flex: 0.5,
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: "red",
          }}
        >
          <PerfectCircle
            color={new Color("#A2A2A2")}
            onPress={this.props.onBackButtonPress}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/question-mark.png")}
              style={{
                width: isMobile ? 8 : 18,
                height: isMobile ? 13 : 25,
              }}
            ></Image>
          </PerfectCircle>
        </View>
        <View
          style={{
            flex: 0.42,
          }}
        ></View>
        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            flex: 10,
          }}
        >
          <View
            style={{
              flex: 5,
              backgroundColor: "green",
            }}
          >
            <div className="player-wrapper">
              <ReactPlayer url="https://www.youtube.com/watch?v=eegQI9WM6mk"></ReactPlayer>
            </div>
          </View>

          <View
            style={{
              backgroundColor: "red",
              flex: 1,
              alignItems: "center",
              alignSelf: "center",
              justifyContent : 'center'
            }}
          >
            <SpacerScreenSegment numSmallDividers={6}></SpacerScreenSegment>
          </View>

          <View
            style={{
              flex: 5,
            }}
          >
            <div className="player-wrapper">
              <ReactPlayer url="https://www.youtube.com/watch?v=eegQI9WM6mk"></ReactPlayer>
            </div>
          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        ></View>
      </View>
    );
  }
}
