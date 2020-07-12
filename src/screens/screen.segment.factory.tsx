import React from 'react';
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
import { SpacerScreenSegment } from './spacer.screen.segment';

export class ScreenSegmentFactory {
  create(payload: ScreenSegmentPayload) {
    let creation;

    if (payload.getType() === CATEGORY_PAYLOAD_TYPE) {
      const factory = new CategoryScreenSegementFactory();
      creation = factory.create(payload as CategoryScreenSegmentPayload);
    } else if (payload.getType() === SPACER_PAYLOAD_TYPE) {
      const factory = new SpacerScreenSegmentFactory();
      creation = factory.create(payload as SpacerScreenSegmentPayload);
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
    return (<SpacerScreenSegment></SpacerScreenSegment>);
  }
}
