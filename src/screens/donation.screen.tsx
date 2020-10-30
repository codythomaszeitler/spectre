import React, { Component } from "react";
import { View, Image, TouchableOpacity, Clipboard } from "react-native";
import { Text } from "react-native-elements";
import { RegularFontFamily } from "../css/styles";
import {isMobile} from 'react-device-detect';

interface State {
  textUnderButtons : string;
}

export class PaypalButtonScreen extends Component {

  state : State;

  constructor(props) {
    super(props);
    this.paypalButtonRef = React.createRef();

    this.goToPaypalDonationPage = this.goToPaypalDonationPage.bind(this);
    this.copyBitcoinAddress = this.copyBitcoinAddress.bind(this);

    this.state = {
      textUnderButtons : "Donations Accepted"
    }
  }

  goToPaypalDonationPage() {
    this.paypalButtonRef.current.click();
  }

  async copyBitcoinAddress() {
    await Clipboard.setString('19Xgnv9qrkZEzPYzhfNF9E87BRNyxqpxK1');
    this.setState({
      textUnderButtons : 'Bitcoin address copied!'
    });
  }

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
            flexBasis: 50,
            flexShrink : 1,
            width : '100%',
            height : '100%'
          }}
        >
          <TouchableOpacity
            onPress={this.copyBitcoinAddress}
            style={{
              flex: 1,
            }}
          >
            <Image
              source={require("../../assets/btc-icon.png")}
              resizeMode="contain"
              style={{
                width : undefined,
                height : undefined,
                flex: 1,
              }}
            ></Image>
          </TouchableOpacity>
          <View
            style={{
              flex: .25,
            }}
          ></View>
          <TouchableOpacity
            onPress={this.goToPaypalDonationPage}
            style={{
              flex: 1,
            }}
          >
            <Image
              source={require("../../assets/bgpaypal.png")}
              resizeMode="contain"
              style={{
                width : undefined,
                height : undefined,
                flex: 1,
              }}
            ></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width : '100%',
            height : '100%',
            flexBasis : isMobile? 12.5 : 25,
            flexShrink : 1
          }}
        >
          <Text
            style={{
                fontSize: isMobile ? 6 : 12,
                fontFamily: RegularFontFamily,
                color : '#7A7A7A',
                letterSpacing : .40
            }}
          >
            {" "}
            {this.state.textUnderButtons}
          </Text>
        </View>

        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_blank"
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
            ref={this.paypalButtonRef}
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
