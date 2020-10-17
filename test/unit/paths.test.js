import { combinePaths } from "../../src/paths";

describe("combinePaths", () => {
  it("returns basepath", () => {
    expect(combinePaths("/base", "/")).toBe("base/");
  });

  it("removes leading slash", () => {
    expect(combinePaths("/base", "/path")).toMatch(/^base.*/);
  });

  it("adds trailing slash", () => {
    expect(combinePaths("/base", "/path")).toMatch(/.*\/$/);
  });

  it("combines two paths", () => {
    expect(combinePaths("/base", "/path")).toBe("base/path/");
  });

  it("combines complex paths", () => {
    expect(combinePaths("/base/path", "/next/path/to/somewhere")).toBe(
      "base/path/next/path/to/somewhere/",
    );
  });

  it("removes unneccessary slashes", () => {
    expect(combinePaths("/base/", "/path/")).toBe("base/path/");
  });
});
