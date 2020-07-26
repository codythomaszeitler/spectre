import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Icon, Text } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import {
  SpectreUser,
  CategoryAddedListener,
  OnCategoryAddedEvent,
  OnTransactionUncategorizedEvent,
  OnCategoryRemovedEvent,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
  OnBeforeCategoryRemovedEvent,
  BeforeCategoryRemovedListener,
} from "../pojo/spectre.user";
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
import { FontFamily, CategoryColors } from "../css/styles";
import { Alert } from "./alert";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import { ScreenSegmentFactory } from "./screen.segment.factory";
import { CategoryScreenSegmentPayload } from "./category.screen.segment.payload";
import { Color } from "../pojo/color";
import { Spacer } from "../pojo/spacer";
import { SpacerScreenSegmentPayload } from "./spacer.screen.segment.payload";
import { LineBreakScreenSegmentPayload } from "./line.break.screen.segment.payload";
import { AddSpacerOrCategoryScreen } from "./add.spacer.or.category.screen";
import { PerfectCircle } from "./perfect.circle";
import { AddCategoryScreenPayload } from "./add.category.screen.payload";
import { ExportButtonScreen } from "./export.button.screen";

export interface Props {}

export interface State {
  screenSegmentPayloads: ScreenSegmentPayload[];
  categories: Category[];
  showImportCsvScreen: boolean;
  showAddCategoryScreen: boolean;
  categoryAddText: string;
  currentTransaction: Transaction;
  isCategorizationMode: boolean;
}

export class CategorizationScreen extends Component
  implements
    DocumentLoadedListener,
    CategoryAddedListener,
    BeforeCategoryRemovedListener,
    TransactionCategorizedListener {
  spectreUser: SpectreUser;
  state: State;
  spacers: Array<Spacer>;

  categoryColors: Object;

  constructor(props: Props) {
    super(props);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onCategoryPress = this.onCategoryPress.bind(this);
    this.onExportCategorized = this.onExportCategorized.bind(this);
    this.onCategorizationStart = this.onCategorizationStart.bind(this);
    this.onCategorizationEnd = this.onCategorizationEnd.bind(this);
    this.onSpacerAddPress = this.onSpacerAddPress.bind(this);
    this.onSuccessfulCategoryAdd = this.onSuccessfulCategoryAdd.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    this.spectreUser.addOnCategoryAddedListener(this);
    this.spectreUser.addCategoryRemovedListener(this);
    this.spectreUser.addBeforeCategoryRemovedListener(this);

    this.categoryColors = {};
    this.spacers = new Array<Spacer>();

    this.state = {
      screenSegmentPayloads: [],
      categories: this.spectreUser.getCategories(),
      showImportCsvScreen: false,
      showAddCategoryScreen: false,
      currentTransaction: undefined,
      isCategorizationMode: false,
      numUncategorized: 0,
      width: 0,
      height: 0,
      bottomBarFlex: 1,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
    this.spectreUser.removeBeforeCategoryRemovedListener(this);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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
      payloads.push(new LineBreakScreenSegmentPayload());
    }

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      payloads.push(this.createPayloadFor(category));

      if (Spacer.containsSpacerAfter(this.spacers, category)) {
        payloads.push(new LineBreakScreenSegmentPayload());
        payloads.push(new SpacerScreenSegmentPayload());
      }

      payloads.push(new LineBreakScreenSegmentPayload());
    }

    if (this.state.showAddCategoryScreen) {
      const payload = new AddCategoryScreenPayload();
      payload.setOnSuccessfulAdd(this.onSuccessfulCategoryAdd);
      payload.setStopAddCategory(() => {
        this.state.showAddCategoryScreen = false;
        this.forceUpdate();

        this.setState({
          screenSegmentPayloads: this.generatePayloadsForCurrentState(),
        });
      });
      payloads.push(payload);
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

  onBeforeCategoryRemoved(event: OnBeforeCategoryRemovedEvent) {
    const removeAndRealignSpacers = (category: Category) => {
      const numSpacersBefore = this.spacers.length;

      this.spacers = this.spacers.filter((spacer) => {
        return !spacer.isAfter(category) && !spacer.isBefore(category);
      });
      const numSpacersAfter = this.spacers.length;
      const wasSpacerRemoved = numSpacersAfter != numSpacersBefore;

      if (wasSpacerRemoved) {
        const before = this.spectreUser.getCategoryBefore(category);
        const after = this.spectreUser.getCategoryAfter(category);

        if (!before && !after) {
          const spacer = new Spacer(
            Spacer.START_OF_CATEGORIES(),
            Spacer.END_OF_CATEGORIES()
          );
          this.spacers.push(spacer);
        } else if (!before) {
          const spacer = new Spacer(Spacer.START_OF_CATEGORIES(), after);
          this.spacers.push(spacer);
        } else if (!after) {
          const spacer = new Spacer(before, Spacer.END_OF_CATEGORIES());
          this.spacers.push(spacer);
        } else {
          const spacer = new Spacer(before, after);
          this.spacers.push(spacer);
        }
      }
    };

    removeAndRealignSpacers(event.category);
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
      this.nextTransaction(() => {
        this.setState({
          screenSegmentPayloads: this.generatePayloadsForCurrentState(),
        });
      });
    }
  }

  onCategorizationEnd() {
    this.setState(
      {
        currentTransaction: null,
        isCategorizationMode: false,
      },
      () => {
        this.setState({
          screenSegmentPayloads: this.generatePayloadsForCurrentState(),
          bottomBarFlex: 2,
        });
      }
    );
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

  nextTransaction(callbackAfterTransactionStateUpdate?: () => void) {
    if (this.spectreUser.hasAnotherTransaction()) {
      const transaction = this.spectreUser.getNextTransaction();

      this.setState(
        {
          currentTransaction: transaction,
          isCategorizationMode: true,
          bottomBarFlex: transaction.getNumDetails() / 1.5,
        },
        callbackAfterTransactionStateUpdate
      );
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
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  onSuccessfulCategoryAdd(category: Category, color: Color) {
    this.state.showAddCategoryScreen = false;
    this.forceUpdate();
    this.onCategoryColorChoice(category, color);

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
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
        <View
          style={{
            flex: 8,
          }}
        >
          <ScrollView
            style={{
              marginHorizontal: 10,
              marginTop: 5,
            }}
          >
            {this.state.screenSegmentPayloads.map(function (
              payload: ScreenSegmentPayload
            ) {
              const factory = new ScreenSegmentFactory();
              return factory.create(payload);
            })}
            <View
              style={{
                justifyContent: "flex-end",
              }}
            >
              <AddSpacerOrCategoryScreen
                onSpacerAddPress={this.onSpacerAddPress}
                onCategoryAddPress={() => {
                  if (this.state.showAddCategoryScreen) {
                  } else {
                    this.state.showAddCategoryScreen = true;
                    this.forceUpdate();

                    this.setState({
                      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
                    });
                  }
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
        <View
          style={{
            flex: this.state.bottomBarFlex,
            backgroundColor: "purple",
          }}
        >
          {!this.state.currentTransaction && (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              ></View>
              <View
                style={{
                  alignSelf: "stretch",
                  flex: 3,
                  backgroundColor: "white",
                  width: "100%",
                  height: "100%",
                }}
              >
                <DocumentPicker
                  onSuccessfulLoadListener={this}
                ></DocumentPicker>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              ></View>
              <View
                style={{
                  alignSelf: "stretch",
                  flex: 3,
                  backgroundColor: "white",
                  width: "100%",
                  height: "100%",
                }}
              >
                <ExportButtonScreen
                  onPress={this.onExportCategorized}
                ></ExportButtonScreen>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              ></View>
              <View
                style={{
                  alignItems: "stretch",
                  flex: 3,
                  backgroundColor: "red",
                  width: "100%",
                  height: "100%",
                }}
              >
                <PerfectCircle
                  color={new Color("#f76f6f")}
                  onPress={this.onCategorizationStart}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontFamily: FontFamily,
                      fontSize: 20,
                    }}
                  >
                    {this.state.numUncategorized}
                  </Text>
                </PerfectCircle>
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
                  textColor={new Color("#000000")}
                  containerStyle={{
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    opacity: 0.33,
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
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "flex-end",
            alignSelf: "flex-start",
            backgroundColor: "pink",
          }}
        >
          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input
              type="hidden"
              name="hosted_button_id"
              value="9EHAV84AATTWC"
            />
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
      </View>
    );
  }
}
