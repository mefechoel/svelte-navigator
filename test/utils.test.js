import { findClosest } from "../src/utils";

describe("findClosest", () => {
  const testElem = {
    tagName: "A",
    parentNode: {
      tagName: "B",
      parentNode: {
        tagName: "C",
        name: "Elem C",
      },
    },
  };

  it("works", () => {
    const closest = findClosest("C", testElem);
    expect(closest.name).toBe("Elem C");
  });
});
