import React, { Component } from "react";
import { View, FlatList } from "react-native";
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
  DocumentLoadedListener,
  OnFileSelectedEvent,
} from "./document.picker.screen";
import { TransactionLoadService } from "../service/transaction.load.service";
import { LocalFileLocation } from "../service/local.file.location";
import { CsvImporter } from "../export/csv.importer";
import { TransactionSaveService } from "../service/transaction.save.service";
import { CsvExporter } from "../export/csv.exporter";
import { Location } from "../service/location";
import { ColumnEstimation } from "../service/column.estimation";
import { CategoryColors, FontFamily } from "../css/styles";
import { Alert } from "./alert";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import { ScreenSegmentFactory } from "./screen.segment.factory";
import { CategoryScreenSegmentPayload } from "./category.screen.segment.payload";
import { Color } from "../pojo/color";
import { Spacer } from "../pojo/spacer";
import { SpacerScreenSegmentPayload } from "./spacer.screen.segment.payload";
import { LineBreakScreenSegmentPayload } from "./line.break.screen.segment.payload";
import { AddCategoryScreenPayload } from "./add.category.screen.payload";
import { PaypalButtonScreen } from "./paypal.button.screen";
import { ViewModeBottomBar } from "./view.mode.bottom.bar";
import { AddSpacerOrCategoryScreenPayload } from "./add.spacer.or.category.screen.payload";
import { CategorizationModeBottomBar } from "./categorization.mode.bottom.bar";
import { Text } from "react-native-elements";

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

const VIEWING_MODE_BOTTOM_BAR_FLEX = 1.15;

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
    this.renderScreenSegmentPayload = this.renderScreenSegmentPayload.bind(
      this
    );
    this.generatePayloadsForCurrentState = this.generatePayloadsForCurrentState.bind(
      this
    );
    this.createAddSpacerOrCategoryScreenPayload = this.createAddSpacerOrCategoryScreenPayload.bind(
      this
    );
    this.createAddCategoryScreenPayload = this.createAddCategoryScreenPayload.bind(
      this
    );

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
      bottomBarFlex: VIEWING_MODE_BOTTOM_BAR_FLEX,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
    this.spectreUser.removeBeforeCategoryRemovedListener(this);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const currentWidowWidth = window.innerWidth;
    const currentWindowHeight = window.innerHeight;

    this.setState({
      width: this.conformToMinWidth(currentWidowWidth),
      height: currentWindowHeight,
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

  renderScreenSegmentPayload({ item }: { item: ScreenSegmentPayload }) {
    const factory = new ScreenSegmentFactory();
    return factory.create(item);
  }

  generatePayloadsForCurrentState() {
    const payloads = [];

    if (Spacer.hasSpacerAtBeginning(this.spacers)) {
      payloads.push(
        new LineBreakScreenSegmentPayload("AT-BEG-FIRST-LINEBREAK-1")
      );
      payloads.push(new SpacerScreenSegmentPayload("AT-BEG-FIRST-SPACER-1"));
      payloads.push(
        new LineBreakScreenSegmentPayload("AT-BEG-SECOND-LINEBREAK-1")
      );
    }

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      payloads.push(this.createPayloadFor(category));

      if (Spacer.containsSpacerAfter(this.spacers, category)) {
        payloads.push(new LineBreakScreenSegmentPayload((i+1) + "LINE-BREAK"));
        payloads.push(new SpacerScreenSegmentPayload((i+1) + "SPACER"));
      }

      payloads.push(new LineBreakScreenSegmentPayload((-1 * (i+1)) + "LINE-BREAK"));
    }

    if (this.state.showAddCategoryScreen) {
      payloads.push(this.createAddCategoryScreenPayload());
    } else {
      payloads.push(this.createAddSpacerOrCategoryScreenPayload());
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

  createAddCategoryScreenPayload() {
    const payload = new AddCategoryScreenPayload();
    payload.setOnSuccessfulAdd(this.onSuccessfulCategoryAdd);
    payload.setStopAddCategory(() => {
      this.setState(
        {
          showAddCategoryScreen: false,
        },
        () => {
          this.setState({
            screenSegmentPayloads: this.generatePayloadsForCurrentState(),
          });
        }
      );
    });
    return payload;
  }

  createAddSpacerOrCategoryScreenPayload() {
    const payload = new AddSpacerOrCategoryScreenPayload()
      .setOnSpacerAddPress(this.onSpacerAddPress)
      .setOnCategoryAddPress(() => {
        if (this.state.showAddCategoryScreen) {
        } else {
          this.state.showAddCategoryScreen = true;
          this.forceUpdate();

          this.setState({
            screenSegmentPayloads: this.generatePayloadsForCurrentState(),
          });
        }
      });
    return payload;
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
          bottomBarFlex: VIEWING_MODE_BOTTOM_BAR_FLEX,
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
          bottomBarFlex: 3,
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
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 8,
          }}
        >
          <FlatList
            data={this.state.screenSegmentPayloads}
            renderItem={this.renderScreenSegmentPayload}
            keyExtractor={(payload) => {
              return payload.getUniqueKey();
            }}
            style={{
              marginHorizontal: 10,
              marginTop: 90,
            }}
          ></FlatList>
        </View>
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
        <View
          style={{
            flex: this.state.bottomBarFlex,
          }}
        >
          {this.state.showAddCategoryScreen && (
            <View style={{
              flex : 1,
              justifyContent : 'center',
              alignItems : 'center'
            }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: FontFamily,
                }}
              >
                Press enter to complete
              </Text>
            </View>
          )}
          {!this.state.showAddCategoryScreen && !this.state.currentTransaction && (
            <View
              style={{
                flex: 1,
              }}
            >
              <ViewModeBottomBar
                onCategorizationStartPress={this.onCategorizationStart}
                numUncategorized={this.state.numUncategorized}
                onExportButtonPress={this.onExportCategorized}
                onSuccessfulLoadListener={this}
              ></ViewModeBottomBar>
            </View>
          )}

          {!this.state.showAddCategoryScreen &&
            this.state.currentTransaction && (
              <CategorizationModeBottomBar
                onCategorizationEnd={this.onCategorizationEnd}
                currentTransaction={this.state.currentTransaction}
                numUncategorized={this.state.numUncategorized}
              ></CategorizationModeBottomBar>
            )}
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: "flex-end",
            alignSelf: "center",
          }}
        >
          <PaypalButtonScreen></PaypalButtonScreen>
        </View>
      </View>
    );
  }
}
