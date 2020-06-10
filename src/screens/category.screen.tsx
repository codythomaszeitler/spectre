import React, { Component } from "react";
import { View } from "react-native";
import { Button, Icon, Card, Text } from "react-native-elements";

export class CategoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: props.color,
      category: props.category,
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Card
          containerStyle={{
            backgroundColor: this.state.color,
            marginTop: 10,
            paddingTop: 15,
            paddingBottom: 15,
            borderRadius: 7,
            borderWidth: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View
              style={{
                justifyContent: "flex-start",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                {this.state.category.getType()}
              </Text>
            </View>

            <View
              style={{
                flex: 5,
              }}
            ></View>
            <View
              style={{
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                5
              </Text>
            </View>
          </View>
        </Card>

        <View
          style={{
            alignSelf: "flex-end",
          }}
        >
          {this.state.category.getTransactions().map((data, index) => {
            return (
              <Card
                containerStyle={{
                  width: 275,
                  backgroundColor: this.state.color,
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  borderRadius: 7,
                  borderWidth: 0,
                }}
              >
                <Text>{data.getAmount().toString()}</Text>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }
}
