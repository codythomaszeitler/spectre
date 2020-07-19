import React from "react";
import { ScreenSegmentPayload } from "./screen.segment.payload";
import {
  CategoryScreenSegmentPayload,
  CATEGORY_PAYLOAD_TYPE,
} from "./category.screen.segment.payload";
import { CategoryScreen } from "./category.screen";
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
import { AddCategoryScreen } from "./add.category.screen";

export class ScreenSegmentFactory {
  create(payload: ScreenSegmentPayload) {
    let creation;

    if (payload.getType() === CATEGORY_PAYLOAD_TYPE) {
      const factory = new CategoryScreenSegementFactory();
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
    } else {
      throw new Error(
        payload.getType() +
          " was not supported for creation, please implement a method for this conversion"
      );
    }

    return creation;
  }
}

class CategoryScreenSegementFactory {
  create(payload: CategoryScreenSegmentPayload) {
    return (
      <CategoryScreen
        color={payload.color}
        category={payload.category}
        categorizationMode={payload.isCategorizationMode}
        onPress={payload.onPress}
        key={payload.category.getType()}
      ></CategoryScreen>
    );
  }
}

class SpacerScreenSegmentFactory {
  create(payload: SpacerScreenSegmentPayload) {
    return <SpacerScreenSegment numSmallDividers={6}></SpacerScreenSegment>;
  }
}

class LineBreakScreenSegmentFactory {
  create(payload: LineBreakScreenSegmentPayload) {
    return (
      <View
        style={{
          height: 10,
        }}
      ></View>
    );
  }
}

class AddCategoryScreenSegmentFactory {
  create(payload: AddCategoryScreenPayload) {
    return (
      <AddCategoryScreen
        onSuccessfulAdd={payload.onSuccessfulAdd}
        onStopAddCategory={payload.onStopAddCategory}
      ></AddCategoryScreen>
    );
  }
}
