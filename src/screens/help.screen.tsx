import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { isMobile } from "react-device-detect";
import { Color } from "../pojo/color";
import ReactPlayer from "react-player";
import { SpacerScreenSegment } from "./spacer.screen.segment";
import { BoldFontFamily } from "../css/styles";

export class HelpScreen extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: 0,
      height: 3000,
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

    this.setState({
      width: this.conformToMinWidth(currentWidowWidth),
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
          alignSelf: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 10,
          }}
        ></View>
        <View
          style={{
            width: 50,
            height: 50,
            alignItems: "center",
            alignSelf: "center",
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
            height: 5,
          }}
        ></View>
        <View
          style={{
            height: 50,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontFamily: BoldFontFamily,
              color: "grey",
            }}
          >
            We are here
          </Text>
        </View>
        <View
          style={{
            height: 375,
            justifyContent: "center",
          }}
        >
          <div className="player-wrapper">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=eegQI9WM6mk"
              className="react-player"
            ></ReactPlayer>
          </div>
        </View>
        <View
          style={{
            height: 5,
          }}
        >
          <SpacerScreenSegment numSmallDividers={6}></SpacerScreenSegment>
        </View>
        <View
          style={{
            height: 50,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontFamily: BoldFontFamily,
              color: "grey",
            }}
          >
            We are here
          </Text>
        </View>
        <View
          style={{
            height: 375,
            justifyContent: "center",
          }}
        >
          <div className="player-wrapper">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=eegQI9WM6mk"
              className="react-player"
            ></ReactPlayer>
          </div>
        </View>
      </View>
    );
  }
}
