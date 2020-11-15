import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { isMobile } from "react-device-detect";
import { Color } from "../pojo/color";
import { SpacerScreenSegment } from "./spacer.screen.segment";
import { BoldFontFamily } from "../css/styles";
import { EmbeddedVideoPlayer } from "./embedded.video.player";
import { TemplateDownloadScreen } from "./template.download.screen";

export class HelpScreen extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: 0,
      height: 925,
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
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1.3,
            backgroundColor: "black",
          }}
        ></View>
        <View
          style={{
            flex: 2,
            alignItems: "center",
            alignSelf: "center",
            width: isMobile ? 75 : 50,
          }}
        >
          <PerfectCircle
            borderColor={new Color("#A2A2A2")}
            color={new Color("#FFFFFF")}
            onPress={this.props.onBackButtonPress}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/move_left_arrow-512.png")}
              style={{
                width: isMobile ? 8 : 30,
                height: isMobile ? 13 : 60,
              }}
            ></Image>
          </PerfectCircle>
        </View>
        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "12%",
              height: "100%",
            }}
          ></View>
          <View
            style={{
              width: "88%",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: BoldFontFamily,
                color: "#A2A2A2",
              }}
            >
              I. Introduction to Scepter
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 15,
            justifyContent: "center",
            width: "75%",
            height: "100%",
          }}
        >
          <EmbeddedVideoPlayer youtubeUrl="https://www.youtube.com/watch?v=IUt0zup2bHc"></EmbeddedVideoPlayer>
        </View>

        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 0.5,
          }}
        >
          <SpacerScreenSegment numSmallDividers={6}></SpacerScreenSegment>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "12%",
              height: "100%",
            }}
          ></View>
          <View
            style={{
              width: "88%",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: BoldFontFamily,
                color: "#A2A2A2",
              }}
            >
              II. Basic budgeting spreadsheet
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 15,
            justifyContent: "center",
            width: "75%",
            height: "100%",
          }}
        >
          <EmbeddedVideoPlayer youtubeUrl="https://www.youtube.com/watch?v=IUt0zup2bHc"></EmbeddedVideoPlayer>
        </View>
        <View
          style={{
            flex: 1,
          }}
        ></View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "12%",
              height: "100%",
            }}
          ></View>
          <View
            style={{
              width: "88%",
              height: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: BoldFontFamily,
                color: "#A2A2A2",
              }}
            >
              Template Downloads
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen name="CSV" color={new Color('#CD8AF4')}></TemplateDownloadScreen>
        </View>
        <View
          style={{
            flex: 0.1,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen name="Excel" color={new Color('#72D4D4')}></TemplateDownloadScreen>
        </View>
        <View
          style={{
            flex: 0.1,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen name="Numbers" color={new Color('#EDB373')}></TemplateDownloadScreen>
        </View>
        <View
          style={{
            flex: 0.1,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen name="Google Sheets" color={new Color('#FF7676')}></TemplateDownloadScreen>
        </View>
        <View
          style={{
            flex: 0.5,
          }}
        ></View>
      </View>
    );
  }
}
