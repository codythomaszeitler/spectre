import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { isMobile } from "react-device-detect";
import { Color } from "../pojo/color";
import { SpacerScreenSegment } from "./spacer.screen.segment";
import { BoldFontFamily } from "../css/styles";
import { EmbeddedVideoPlayer } from "./embedded.video.player";
import { TemplateDownloadScreen } from "./template.download.screen";

const SPACING_BETWEEN_TEMPLATES = 0.4;

export class HelpScreen extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      width: 0,
      height: 1175,
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
            width: isMobile ? 75 : 40,
          }}
        >
          <PerfectCircle
            borderColor={new Color("#A2A2A2")}
            color={new Color("#FFFFFF")}
            onPress={this.props.onBackButtonPress}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/back-arrow.png")}
              style={{
                width: isMobile ? 8 : 18,
                height: isMobile ? 13 : 40,
              }}
            ></Image>
          </PerfectCircle>
        </View>
        <View
          style={{
            flex: 1.8,
            width: "100%",
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
            flex: 0.26,
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
            flex: 2.07,
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
              II. Basic budgeting spreadsheet
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: .26,
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
        <View style={{
          flex : .45
        }}></View>
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
          <TemplateDownloadScreen
            name="Numbers"
            color={new Color("#EDB373")}
            resource={
              "https://s3-us-west-1.amazonaws.com/scepter.template.org/ASU+MCS+Online+Class+Review+(Responses).xlsx"
            }
            downloadFileName={"scepter.template.xlsx"}
          ></TemplateDownloadScreen>
        </View>
        <View
          style={{
            flex: SPACING_BETWEEN_TEMPLATES,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen
            name="Excel"
            color={new Color("#72D4D4")}
            resource={
              "https://s3-us-west-1.amazonaws.com/scepter.template.org/ASU+MCS+Online+Class+Review+(Responses).xlsx"
            }
            downloadFileName={"scepter.template.xlsx"}
          ></TemplateDownloadScreen>
        </View>

        <View
          style={{
            flex: SPACING_BETWEEN_TEMPLATES,
          }}
        ></View>
        <View
          style={{
            flex: 2,
            width: "100%",
          }}
        >
          <TemplateDownloadScreen
            disabled
            name="Google Sheets"
            color={new Color("#FF7676")}
            resource={
              "https://s3-us-west-1.amazonaws.com/scepter.template.org/ASU+MCS+Online+Class+Review+(Responses).xlsx"
            }
            downloadFileName={"scepter.template.xlsx"}
          ></TemplateDownloadScreen>
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
