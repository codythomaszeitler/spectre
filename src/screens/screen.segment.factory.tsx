import React from "react";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import {
  CategoryScreenSegmentPayload,
  CATEGORY_PAYLOAD_TYPE,
} from "./category.screen.segment.payload";
import { CategoryScreen, CATEGORY_BOX_HEIGHT } from "./category.screen";
import {
  SpacerScreenSegmentPayload,
  SPACER_PAYLOAD_TYPE,
} from "./spacer.screen.segment.payload";
import { SpacerScreenSegment } from "./spacer.screen.segment";
import {
  LineBreakScreenSegmentPayload,
  LINE_BREAK_TYPE,
} from "./line.break.screen.segment.payload";
import { View } from "react-native";
import {
  AddCategoryScreenPayload,
  ADD_CATEGORY_SCREEN_PAYLOAD_TYPE,
} from "./add.category.screen.payload";
import {
  AddSpacerOrCategoryScreenPayload,
  ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE,
} from "./add.spacer.or.category.screen.payload";
import { AddSpacerOrCategoryScreen } from "./add.spacer.or.category.screen";
import { AddCategoryScreen } from "./add.category.screen";
import { isMobile } from "react-device-detect";

export class ScreenSegmentFactory {
  create(payload: ScreenSegmentPayload) {
    let creation;

    if (payload.getType() === CATEGORY_PAYLOAD_TYPE) {
      const factory = new CategoryScreenSegmentFactory();
      creation = factory.create(payload as CategoryScreenSegmentPayload);
    } else if (payload.getType() === SPACER_PAYLOAD_TYPE) {
      const factory = new SpacerScreenSegmentFactory();
      creation = factory.create(payload as SpacerScreenSegmentPayload);
    } else if (payload.getType() === LINE_BREAK_TYPE) {
      const factory = new LineBreakScreenSegmentFactory();
      creation = factory.create(payload as LineBreakScreenSegmentPayload);
    } else if (payload.getType() === ADD_CATEGORY_SCREEN_PAYLOAD_TYPE) {
      const factory = new AddCategoryScreenSegmentFactory();
      creation = factory.create(payload as AddCategoryScreenPayload);
    } else if (payload.getType() === ADD_SPACER_OR_CATEGORY_PAYLOAD_TYPE) {
      const factory = new AddCategoryOrSpacerScreenSegementFactory();
      creation = factory.create(payload as AddSpacerOrCategoryScreenPayload);
    } else {
      throw new Error(
        payload.getType() +
          " was not supported for creation, please implement a method for this conversion"
      );
    }

    return creation;
  }
}

class CategoryScreenSegmentFactory {
  create(payload: CategoryScreenSegmentPayload) {
    return (
      <CategoryScreen
        color={payload.color}
        category={payload.category}
        categorizationMode={payload.isCategorizationMode}
        onPress={payload.onPress}
        onColorChoice={payload.onColorChange}
        key={payload.getUniqueKey()}
      ></CategoryScreen>
    );
  }
}

class SpacerScreenSegmentFactory {
  create(payload: SpacerScreenSegmentPayload) {
    return (
      <SpacerScreenSegment
        numSmallDividers={6}
        key={payload.getUniqueKey()}
        uniqueKey={payload.getUniqueKey()}
      ></SpacerScreenSegment>
    );
  }
}

class LineBreakScreenSegmentFactory {
  create(payload: LineBreakScreenSegmentPayload) {
    return (
      <View
        style={{
          height: isMobile ? 10 : 16,
        }}
        key={payload.getUniqueKey()}
      ></View>
    );
  }
}

class AddCategoryScreenSegmentFactory {
  create(payload: AddCategoryScreenPayload) {
    return (
      <AddCategoryScreen
        key={payload.getUniqueKey()}
        onSuccessfulAdd={payload.onSuccessfulAdd}
        onStopAddCategory={payload.onStopAddCategory}
      ></AddCategoryScreen>
    );
  }
}

class AddCategoryOrSpacerScreenSegementFactory {
  create(payload: AddSpacerOrCategoryScreenPayload) {
    return (
      <View
        style={{
          flex: 1,
          height: CATEGORY_BOX_HEIGHT,
        }}
      >
        <AddSpacerOrCategoryScreen
          onSpacerAddPress={payload.onSpacerAddPress}
          onCategoryAddPress={payload.onCategoryAddPress}
        ></AddSpacerOrCategoryScreen>
      </View>
    );
  }
}
