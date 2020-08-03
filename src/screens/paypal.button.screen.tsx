import React, { Component } from "react";
import { View, Image } from "react-native";
import { Text } from "react-native-elements";
import { FontFamily } from "../css/styles";

export class PaypalButtonScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../../assets/btc-icon.png")}
            resizeMode="contain"
            style={{
              width: 150,
              height: 75,
              flex: 1,
            }}
          ></Image>
          <View
            style={{
              flex: 5,
            }}
          ></View>
          <Image
            source={require("../../assets/paypal.png")}
            resizeMode="contain"
            style={{
              width: 150,
              height: 75,
              flex: 1,
            }}
          ></Image>
        </View>
        <View style={{
          flex : 1,
          justifyContent : 'center',
          alignItems : 'center'
        }}>
          <Text style={{
            fontSize : 12,
            fontFamily : FontFamily
          }}> Donations Accepted</Text>
        </View>

        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="9EHAV84AATTWC" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
            hidden={true}
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </View>
    );
  }
}
