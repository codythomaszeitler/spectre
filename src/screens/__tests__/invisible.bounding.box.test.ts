import { InvisibleBoundingBox } from "../invisible.bounding.box";

describe("Invisible Bounding Box", () => {
  it("should be able to tell if one rectangle intersects another", () => {
    const a = new InvisibleBoundingBox(0, 0, 100, 100);
    const b = new InvisibleBoundingBox(50, 50, 100, 100);

    expect(a.intersects(b)).toBe(true);
  });

  it("should be able to tell if one rectangle does not intersect another", () => {
    const a = new InvisibleBoundingBox(0, 0, 100, 100);
    const b = new InvisibleBoundingBox(1000, 1000, 100, 100);

    expect(a.intersects(b)).toBe(false);
  });

  it("should be able to copy the bounding box", () => {
    const a = new InvisibleBoundingBox(0, 0, 100, 100);
    expect(a.copy()).toEqual(a);
  });

  it("should throw an exception if the width is less than one", () => {
    let caughtException = null;
    try {

        new InvisibleBoundingBox(0,0,0,10);

    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot create a bounding box with a non-positive width [0]"
    );
  });

  it("should throw an exception if the height is less than one", () => {
    let caughtException = null;
    try {

        new InvisibleBoundingBox(0,0,10,0);

    } catch (e) {
      caughtException = e;
    }

    expect(caughtException.message).toBe(
      "Cannot create a bounding box with a non-positive height [0]"
    );
  });
});
