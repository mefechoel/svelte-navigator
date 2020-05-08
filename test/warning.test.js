/* eslint-disable no-console */
import { warn, ROUTER_ID, LINK_ID, fail } from "../src/warning";

describe("warn", () => {
  it("router", () => {
    console.warn = jest.fn();
    warn(ROUTER_ID, "test-msg");
    expect(console.warn).toHaveBeenCalledWith("<Router> test-msg");
  });

  it("link", () => {
    console.warn = jest.fn();
    warn(LINK_ID, "test-msg");
    expect(console.warn).toHaveBeenCalledWith("<Link> test-msg");
  });
});

describe("fail", () => {
  it("router", () => {
    const err = () => fail(ROUTER_ID, "test-error");
    expect(err).toThrowError("<Router> test-error");
  });

  it("link", () => {
    const err = () => fail(LINK_ID, "test-error");
    expect(err).toThrowError("<Link> test-error");
  });
});
