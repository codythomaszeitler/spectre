import React, { Component } from "react";
import { View, FlatList, Image, ViewComponent } from "react-native";
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
  CategoryNameChangeListener,
  OnCategoryNameChangeEvent,
} from "../pojo/spectre.user";
import { Transaction } from "../pojo/transaction";
import { OnCategoryPressed } from "./category.screen";
import { Category } from "../pojo/category";
import { LocalFileLocation } from "../service/local.file.location";
import { TransactionSaveService } from "../service/transaction.save.service";
import { CsvExporter } from "../export/csv.exporter";
import { CategoryColors, RegularFontFamily } from "../css/styles";
import { Alert } from "./alert";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import { ScreenSegmentFactory } from "./screen.segment.factory";
import { CategoryScreenSegmentPayload } from "./category.screen.segment.payload";
import { Color } from "../pojo/color";
import { Spacer } from "../pojo/spacer";
import { SpacerScreenSegmentPayload } from "./spacer.screen.segment.payload";
import { LineBreakScreenSegmentPayload } from "./line.break.screen.segment.payload";
import { AddCategoryScreenPayload } from "./add.category.screen.payload";
import { ViewModeBottomBar } from "./view.mode.bottom.bar";
import { AddSpacerOrCategoryScreenPayload } from "./add.spacer.or.category.screen.payload";
import { CategorizationModeBottomBar } from "./categorization.mode.bottom.bar";
import { Text } from "react-native-elements";
import { PerfectCircle } from "./perfect.circle";
import { isMobile } from "react-device-detect";
import { Modal } from "./modal.screen";
import {
  CsvSelectionScreen,
  OnFilesWithCsvTypeSelectedEvent,
} from "./import/csv.selection.screen";
import { FileCsvTypeDuoSelectedListener } from "./import/csv.selection.screen";
import { TransactionLoaderFactory } from "../service/transaction.loader.factory";
import { WithViewContextExporter } from "../export/with.view.context.exporter";
import { ViewContext } from "./view.context";

export interface Props {}

export interface State {
  screenSegmentPayloads: ScreenSegmentPayload[];
  categories: Category[];
  showImportCsvScreen: boolean;
  showAddCategoryScreen: boolean;
  categoryAddText: string;
  currentTransaction: Transaction;
  isCategorizationMode: boolean;
  isImporting: boolean;
}

const VIEWING_MODE_BOTTOM_BAR_FLEX = 1.15;

export class CategorizationScreen
  extends Component
  implements
    CategoryAddedListener,
    BeforeCategoryRemovedListener,
    TransactionCategorizedListener,
    FileCsvTypeDuoSelectedListener,
    CategoryNameChangeListener {
  spectreUser: SpectreUser;
  state: State;
  spacers: Array<Spacer>;

  categoryColors: Map<string, Color>;
  categoryOrder: Map<string, number>;

  constructor(props: Props) {
    super(props);
    this.onCategoryPress = this.onCategoryPress.bind(this);
    this.onExportCategorized = this.onExportCategorized.bind(this);
    this.onCategorizationStart = this.onCategorizationStart.bind(this);
    this.onCategorizationEnd = this.onCategorizationEnd.bind(this);
    this.onSpacerAddPress = this.onSpacerAddPress.bind(this);
    this.onCategoryColorChoice = this.onCategoryColorChoice.bind(this);
    this.onSuccessfulCategoryAdd = this.onSuccessfulCategoryAdd.bind(this);
    this.onFilesWithTypeSelectedListener = this.onFilesWithTypeSelectedListener.bind(
      this
    );
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
    this.loadHelpYoutubeWebsite = this.loadHelpYoutubeWebsite.bind(this);
    this.onCategoryNameChange = this.onCategoryNameChange.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    this.spectreUser.addOnCategoryAddedListener(this);
    this.spectreUser.addCategoryRemovedListener(this);
    this.spectreUser.addBeforeCategoryRemovedListener(this);
    this.spectreUser.addOnCategoryNameChangeListener(this);

    this.categoryColors = new Map<string, Color>();
    this.categoryOrder = new Map<string, number>();
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
      isHoveringOverHelp: false,
      isImporting: false,
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
    this.spectreUser.removeOnCategoryNameChangeListener(this);
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
      const transactionSaveService = new TransactionSaveService(
        new CsvExporter(
          new WithViewContextExporter(this.createViewContextFromCurrentState())
        )
      );

      await transactionSaveService.save(this.spectreUser, location);
    } catch (e) {
      let errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  private createViewContextFromCurrentState() {
    const builder = new ViewContext.Builder();

    const categories = this.spectreUser.getCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const color = this.categoryColors.get(category.getName());
      const ordering = this.categoryOrder.get(category.getName());

      builder.setCategoryColor(category, color);
      builder.setCategoryOrdering(category, ordering);
    }

    return builder.build();
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

    // We need to somehow
    const categories = this.getSortedCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      payloads.push(this.createPayloadFor(category));

      if (Spacer.containsSpacerAfter(this.spacers, category)) {
        payloads.push(new LineBreakScreenSegmentPayload(i + 1 + "LINE-BREAK"));
        payloads.push(new SpacerScreenSegmentPayload(i + 1 + "SPACER"));
      }

      payloads.push(
        new LineBreakScreenSegmentPayload(-1 * (i + 1) + "LINE-BREAK")
      );
    }

    if (this.state.showAddCategoryScreen) {
      payloads.push(this.createAddCategoryScreenPayload());
    } else {
      payloads.push(this.createAddSpacerOrCategoryScreenPayload());
    }

    return payloads;
  }

  private getSortedCategories() {
    const sorted = [];
    const categories = this.spectreUser.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const ordering = this.categoryOrder.get(category.getName());
      sorted.push({
        category,
        ordering,
      });
    }

    sorted.sort(function (a, b) {
      return a.ordering - b.ordering;
    });

    const final = [];
    for (let i = 0; i < sorted.length; i++) {
      const element = sorted[i];
      final.push(element.category);
    }

    return final;
  }

  createPayloadFor(category: Category) {
    const categoryPayload = new CategoryScreenSegmentPayload(category)
      .setColor(this.getColorFor(category))
      .setCategorizationMode(this.state.isCategorizationMode)
      .setOnPress(this.onCategoryPress)
      .setOnColorChange(this.onCategoryColorChoice);
    return categoryPayload;
  }

  getColorFor(category: Category) {
    let color = new Color(CategoryColors[0]);

    if (this.categoryColors.has(category.getName())) {
      color = this.categoryColors.get(category.getName())?.copy();
    }
    return color;
  }

  onCategoryColorChoice(category: Category, color: Color) {
    this.categoryColors.set(category.getName(), color);

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

    this.categoryOrder.set(
      event.category.getName(),
      this.getNextHighestSortOrder()
    );

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  private getNextHighestSortOrder() {
    let highest = 0;

    const orderings = this.categoryOrder.values();
    let ordering = orderings.next();
    while (!ordering.done) {
      if (highest < ordering.value) {
        highest = ordering.value;
      }

      ordering = orderings.next();
    }

    return highest + 1;
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
    this.spectreUser.removeTransactionCategorizedListener(event.category, this);
    this.spectreUser.removeTransactionUncategorizedListener(
      event.category,
      this
    );

    this.removeColorChoice(event.category);
    this.removeOrderChoice(event.category);

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  removeColorChoice(category: Category) {
    this.categoryColors.delete(category.getName());
  }

  removeOrderChoice(category: Category) {
    this.categoryOrder.delete(category.getName());
  }

  onCategoryNameChange(event: OnCategoryNameChangeEvent) {
    const oldColor = this.categoryColors.get(event.oldCategory.getName());

    this.removeColorChoice(event.oldCategory);

    this.spectreUser.removeTransactionCategorizedListener(
      event.oldCategory,
      this
    );
    this.spectreUser.removeTransactionUncategorizedListener(
      event.oldCategory,
      this
    );
    this.spectreUser.addTransactionCategorizedListener(event.newCategory, this);
    this.spectreUser.addTransactionUncategorizedListener(
      event.newCategory,
      this
    );

    this.onCategoryColorChoice(event.newCategory, oldColor);
    this.onCategoryOrderChoice(
      event.newCategory,
      this.getOrderForCategory(event.oldCategory)
    );
    this.removeOrderChoice(event.oldCategory);

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
  }

  onCategoryOrderChoice(category: Category, ordering: number) {
    this.categoryOrder.set(category.getName(), ordering);
  }

  getOrderForCategory(category: Category) {
    return this.categoryOrder.get(category.getName());
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

  async onFilesWithTypeSelectedListener(
    event: OnFilesWithCsvTypeSelectedEvent
  ) {
    this.setState(
      {
        isImporting: true,
      },
      async () => {
        const pairs = event.pairs;

        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          const file = pair.file;
          const csvType = pair.csvType;

          try {
            const location = new LocalFileLocation(file);
            const factory = new TransactionLoaderFactory();
            const service = factory.create(csvType, location);
            const canLoadResult = await service.canLoad(location);

            if (!canLoadResult.canLoad) {
              console.log(canLoadResult);
              let errorDialog = new Alert();

              const errorMessage =
                "File " +
                location.getFileName() +
                " did not have the proper format for " +
                csvType.get();

              errorDialog.show(errorMessage);
              return;
            }
          } catch (e) {
            console.log(e);
            let errorDialog = new Alert();
            errorDialog.show(e.message);
          }
        }

        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          const file = pair.file;
          const csvType = pair.csvType;

          try {
            const location = new LocalFileLocation(file);
            if (await location.isEmpty()) {
              return;
            }

            const factory = new TransactionLoaderFactory();
            const service = factory.create(csvType, location);
            const viewContext = await service.load(this.spectreUser, location);

            this.alignViewContext(viewContext);
          } catch (e) {
            console.log(e);
            let errorDialog = new Alert();
            errorDialog.show(e.message);
          }
        }
        this.setState({
          showImportCsvScreen: false,
          numUncategorized: this.spectreUser.getUncategorized().length,
          isImporting: false,
        });
      }
    );
  }

  alignViewContext(viewContext: ViewContext) {
    const categories = viewContext.getCategories();
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      this.categoryColors.set(
        category.getName(),
        viewContext.getColorFor(category)
      );
      this.categoryOrder.set(
        category.getName(),
        viewContext.getOrderFor(category)
      );
    }

    this.setState({
      screenSegmentPayloads: this.generatePayloadsForCurrentState(),
    });
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
      console.log(e);
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
    if (this.state.isImporting) {
      return;
    }

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

  loadHelpYoutubeWebsite() {
    const win = window.open(
      "https://www.youtube.com/watch?v=8LEqwPOehpE",
      "_blank"
    );
    if (win != null) {
      win.focus();
    }
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
        <Modal
          isVisible={this.state.showImportCsvScreen}
          onBackdropPress={() => {
            this.setState({
              showImportCsvScreen: false,
            });
          }}
        >
          {this.state.showImportCsvScreen && (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
              }}
            >
              <CsvSelectionScreen
                onFileCsvTypeDuoSelectedListener={this}
              ></CsvSelectionScreen>
            </View>
          )}
        </Modal>
        <View
          style={{
            flex: 0.42,
          }}
        ></View>
        <View
          style={{
            flex: 0.5,
            alignItems: "center",
            alignSelf: "center",
            width: isMobile ? 75 : 50,
          }}
          onMouseEnter={() => {
            this.setState({
              isHoveringOverHelp: true,
            });
          }}
          onMouseLeave={() => {
            this.setState({
              isHoveringOverHelp: false,
            });
          }}
        >
          <PerfectCircle
            color={new Color("#A2A2A2")}
            onPress={this.loadHelpYoutubeWebsite}
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
            flex: 0.25,
          }}
        ></View>
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
              marginVertical: 6,
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: RegularFontFamily,
                  color: "#A2A2A2",
                  letterSpacing: 0.4,
                }}
              >
                Press enter to complete.
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
                onImportButtonPress={() => {
                  this.setState({
                    showImportCsvScreen: true,
                  });
                }}
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
            flex: 0.25,
          }}
        ></View>
      </View>
    );
  }
}
