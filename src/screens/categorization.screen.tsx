import React, { Component } from "react";
import { View, TouchableOpacity, Animated, ScrollView } from "react-native";
import { Button, Icon, Card, Text } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import {
  SpectreUser,
  CategoryAddedListener,
  OnCategoryAddedEvent,
  OnTransactionUncategorizedEvent,
  OnCategoryRemovedEvent,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
} from "../pojo/spectre.user";
import { Modal } from "./modal.screen";
import { Transaction } from "../pojo/transaction";
import { OnCategoryPressed } from "./category.screen";
import { Category } from "../pojo/category";
import {
  DocumentPicker,
  DocumentLoadedListener,
  OnFileSelectedEvent,
} from "./document.picker.screen";
import { TransactionLoadService } from "../service/transaction.load.service";
import { LocalFileLocation } from "../service/local.file.location";
import { CsvImporter } from "../export/csv.importer";
import { TransactionSaveService } from "../service/transaction.save.service";
import { CsvExporter } from "../export/csv.exporter";
import { TransactionScreenSegment } from "./transaction.screen.segment";
import { Location } from "../service/location";
import { ColumnEstimation } from "../service/column.estimation";
import { AddCategoryScreen } from "./add.category.screen";
import { FontFamily, CategoryColors } from "../css/styles";
import { Alert } from "./alert";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import { ScreenSegmentFactory } from "./screen.segment.factory";
import { CategoryScreenSegmentPayload } from "./category.screen.segment.payload";
import { Color } from "../pojo/color";
import { Spacer } from "../pojo/spacer";
import { SpacerScreenSegmentPayload } from "./spacer.screen.segment.payload";
import { LineBreakScreenSegmentPayload } from "./line.break.screen.segment.payload";
import { AddCategoryButton } from "./add.category.button.screen";
import { AddSpacerOrCategoryScreen } from "./add.spacer.or.category.screen";

export interface Props {}

export interface State {
  screenSegmentPayloads: ScreenSegmentPayload[];
  categories: Category[];
  showImportCsvScreen: boolean;
  showAddCategoryScreen: boolean;
  categoryAddText: string;
  currentTransaction: Transaction;
  pan: Animated.ValueXY;
  isCategorizationMode: boolean;
}

export class CategorizationScreen extends Component
  implements
    DocumentLoadedListener,
    CategoryAddedListener,
    TransactionCategorizedListener {
  spectreUser: SpectreUser;
  state: State;
  spacers: Array<Spacer>;

  categoryColors: Object;

  constructor(props: Props) {
    super(props);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onImportPress = this.onImportPress.bind(this);
    this.onCategoryPress = this.onCategoryPress.bind(this);
    this.onExportCategorized = this.onExportCategorized.bind(this);
    this.onCategorizationStart = this.onCategorizationStart.bind(this);
    this.onCategorizationEnd = this.onCategorizationEnd.bind(this);
    this.onSpacerAddPress = this.onSpacerAddPress.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    this.spectreUser.addOnCategoryAddedListener(this);
    this.spectreUser.addCategoryRemovedListener(this);

    this.categoryColors = {};
    this.spacers = new Array<Spacer>();

    this.state = {
      screenSegmentPayloads: [],
      pan: new Animated.ValueXY(),
      categories: this.spectreUser.getCategories(),
      showImportCsvScreen: false,
      showAddCategoryScreen: false,
      currentTransaction: undefined,
      isCategorizationMode: false,
      numUncategorized: 0,
      width: 0,
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.categoryBoxLocations = {};
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  onImportPress() {
    this.setState({
      showImportCsvScreen: true,
    });
  }

  async onExportCategorized() {
    try {
      const file = new File([], "test.csv", {
        type: "text/plain;charset=utf-8",
      });
      const location = new LocalFileLocation(file);
      const columns = TransactionSaveService.generateCompliantColumns(
        this.spectreUser
      );

      const transactionSaveService = new TransactionSaveService(
        this.spectreUser,
        location,
        new CsvExporter(columns)
      );

      await transactionSaveService.save();
    } catch (e) {
      let errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  generatePayloadsForCurrentState() {
    const payloads = [];

    if (Spacer.hasSpacerAtBeginning(this.spacers)) {
      payloads.push(new LineBreakScreenSegmentPayload());
      payloads.push(new SpacerScreenSegmentPayload());
    }

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      payloads.push(this.createPayloadFor(category));

      if (Spacer.containsSpacerAfter(this.spacers, category)) {
        payloads.push(new LineBreakScreenSegmentPayload());
        payloads.push(new SpacerScreenSegmentPayload());
      }
    }

    return payloads;
  }

  createPayloadFor(category: Category) {
    const categoryPayload = new CategoryScreenSegmentPayload(category)
      .setColor(this.getColorFor(category))
      .setCategorizationMode(this.state.isCategorizationMode)
      .setOnPress(this.onCategoryPress);
    return categoryPayload;
  }

  getColorFor(category: Category) {
    let color = new Color(CategoryColors[0]);
    if (category.getType() in this.categoryColors) {
      color = this.categoryColors[category.getType()].copy();
    }
    return color;
  }

  onCategoryColorChoice(category: Category, color: Color) {
    this.categoryColors[category.getType()] = color;

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  onCategoryAdded(event: OnCategoryAddedEvent) {
    const getAndRemoveSpacerAtBottom = () => {
      let foundIndex = -1;
      for (let i = 0; i < this.spacers.length; i++) {
        const spacer = this.spacers[i];
        if (spacer.isAtEnd()) {
          foundIndex = i;
          break;
        }
      }

      return this.spacers.splice(foundIndex, 1)[0];
    };

    if (Spacer.hasSpacerAtEnd(this.spacers)) {
      const bottomMostSpacer = getAndRemoveSpacerAtBottom();

      const spacer = new Spacer(bottomMostSpacer.getBefore(), event.category);
      this.spacers.push(spacer);
    }

    this.spectreUser.addTransactionCategorizedListener(event.category, this);
    this.spectreUser.addTransactionUncategorizedListener(event.category, this);

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  onCategoryRemoved(event: OnCategoryRemovedEvent) {
    const removeColorChoice = (category: Category) => {
      delete this.categoryColors[category.getType()];
    };

    this.spectreUser.removeTransactionCategorizedListener(event.category, this);
    this.spectreUser.removeTransactionUncategorizedListener(
      event.category,
      this
    );

    removeColorChoice(event.category);

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  onCategorizationStart() {
    if (this.spectreUser.hasAnotherTransaction()) {
      this.nextTransaction();

      this.setState({
        screenSegmentPayloads: this.generatePayloadsForCurrentState(),
      });
    }
  }

  onCategorizationEnd() {
    this.state.currentTransaction = null;
    this.state.isCategorizationMode = false;
    this.forceUpdate();

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  async onFileSelect(event: OnFileSelectedEvent) {
    try {
      const location = new LocalFileLocation(event.file);
      if (await location.isEmpty()) {
        return;
      }

      const estimator = new ColumnEstimation();
      const columns = await estimator.estimateByLocation(location);

      const loadService = new TransactionLoadService(
        this.spectreUser,
        location,
        new CsvImporter(columns)
      );
      await loadService.load();

      this.setState({
        showImportCsvScreen: false,
        numUncategorized: this.spectreUser.getUncategorized().length,
      });
    } catch (e) {
      let errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  onCategoryPress(event: OnCategoryPressed) {
    try {
      if (this.state.currentTransaction) {
        this.spectreUser.categorize(
          this.state.currentTransaction,
          event.category
        );

        this.nextTransaction();
      }
    } catch (e) {
      let errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  nextTransaction() {
    if (this.spectreUser.hasAnotherTransaction()) {
      const uncategorized = this.spectreUser.getUncategorized();
      const transaction = uncategorized.shift();

      this.state.currentTransaction = transaction;
      this.state.isCategorizationMode = true;

      this.forceUpdate();
    } else {
      this.onCategorizationEnd();
    }
  }

  onTransactionCategorized(event: OnTransactionCategorizedEvent) {
    this.setState({
      numUncategorized: this.spectreUser.getUncategorized().length,
    });
  }

  onTransactionUncategorized(event: OnTransactionUncategorizedEvent) {
    let currentTransaction = null;
    if (this.state.isCategorizationMode) {
      currentTransaction = this.spectreUser.getUncategorized().shift();
    }

    this.setState({
      currentTransaction: currentTransaction,
      numUncategorized: this.spectreUser.getUncategorized().length,
    });
  }

  onSpacerAddPress() {
    const getMostRecentlyAddedCategory = () => {
      const categories = this.spectreUser.getCategories();
      const lastAddedCategory = categories.pop();
      return lastAddedCategory;
    };

    const hasAtLeastOneCategory = () => {
      const categories = this.spectreUser.getCategories();
      return categories.length != 0;
    };

    const hasAtLeastOneSpacer = () => {
      return this.spacers.length != 0;
    };

    if (hasAtLeastOneCategory()) {
      const lastAddedCategory = getMostRecentlyAddedCategory();

      if (!Spacer.hasSpacerAtEnd(this.spacers)) {
        const spacer = new Spacer(
          lastAddedCategory,
          Spacer.END_OF_CATEGORIES()
        );
        this.spacers.push(spacer);
      }
    } else {
      if (!hasAtLeastOneSpacer()) {
        const spacer = new Spacer(
          Spacer.START_OF_CATEGORIES(),
          Spacer.END_OF_CATEGORIES()
        );
        this.spacers.push(spacer);
      }
    }

    this.setState({
      screenSegmentPayloads : this.generatePayloadsForCurrentState()
    });
  }

  render() {
    return (
      <View
        style={{
          width: this.state.width,
          height: this.state.height,
          justifyContent: "space-around",
          alignContent: "stretch",
        }}
      >
        <Modal
          isVisible={this.state.showImportCsvScreen}
          onBackdropPress={() => {
            this.setState({
              showImportCsvScreen: false,
            });
          }}
        >
          <Card>
            <DocumentPicker onSuccessfulLoadListener={this}></DocumentPicker>
          </Card>
        </Modal>
        <Modal
          isVisible={this.state.showAddCategoryScreen}
          onBackdropPress={() => {
            this.setState({
              showAddCategoryScreen: false,
            });
          }}
        >
          <AddCategoryScreen
            onSuccessfulAdd={(category, color) => {
              this.setState({
                showAddCategoryScreen: false,
              });
              this.onCategoryColorChoice(category, color);
            }}
          ></AddCategoryScreen>
        </Modal>
        <View
          style={{
            flex: 8,
          }}
        >
          <ScrollView>
            {
              <View>
                {this.state.screenSegmentPayloads.map(function (
                  payload: ScreenSegmentPayload
                ) {
                  const factory = new ScreenSegmentFactory();
                  return factory.create(payload);
                })}
              </View>
            }
            <View
              style={{
                justifyContent: "flex-end",
              }}
            >
              <AddSpacerOrCategoryScreen
                onSpacerAddPress={this.onSpacerAddPress}
                onCategoryAddPress={() => {
                  this.setState({
                    showAddCategoryScreen: true,
                  });
                }}
              ></AddSpacerOrCategoryScreen>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
        {!this.state.currentTransaction && (
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View
              style={{
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  marginLeft: 30,
                  marginRight: 30,
                  backgroundColor: "#1FDA5D",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 50,
                  height: 50,
                }}
                onPress={this.onImportPress}
              >
                <Icon name={"add"} size={15} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  marginLeft: 30,
                  marginRight: 30,
                  backgroundColor: "#DA9F1F",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 50,
                  height: 50,
                }}
                onPress={this.onExportCategorized}
              >
                <Icon name={"chevron-right"} size={15} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flex: 3,
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(255,0,0,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 75,
                  height: 75,
                  backgroundColor: "red",
                  borderRadius: 50,
                }}
                onPress={this.onCategorizationStart}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: FontFamily,
                    fontSize: 26,
                  }}
                >
                  {this.state.numUncategorized}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5 }}></View>
          </View>
        )}

        {this.state.currentTransaction && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                flex: 1,
                alignSelf: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "rgba(255,0,0,1)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
                onPress={this.onCategorizationEnd}
              >
                <Text
                  style={{
                    color: "red",
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 8,
              }}
            >
              <TransactionScreenSegment
                canDelete={false}
                transaction={this.state.currentTransaction}
                textColor="black"
                containerStyle={{
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 1.0,
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  borderRadius: 7,
                  borderWidth: 0,
                }}
              ></TransactionScreenSegment>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "flex-end",
              }}
            ></View>
          </View>
        )}
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
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
