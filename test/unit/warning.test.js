/* eslint-disable no-console */
import {
  ROUTER_ID,
  ROUTE_ID,
  LINK_ID,
  fail,
  createMessage,
  createMessageHandler,
} from "../../src/warning";

describe("createMessage", () => {
  it("creates basic message", () => {
    expect(createMessage(ROUTER_ID, "test-msg")).toMatchSnapshot();
  });

  it("creates message with props (link)", () => {
    expect(
      createMessage(LINK_ID, "test-msg", { to: "test-path" }),
    ).toMatchSnapshot();
  });

  it("creates message with props (route path)", () => {
    expect(
      createMessage(ROUTE_ID, "test-msg", { path: "test-path" }),
    ).toMatchSnapshot();
  });

  it("creates message with props (route default)", () => {
    expect(
      createMessage(ROUTE_ID, "test-msg", { path: "", default: true }),
    ).toMatchSnapshot();
  });

  it("creates message with props and message fn (route path)", () => {
    expect(
      createMessage(ROUTE_ID, label => `test-msg ${label}`, {
        path: "test-path",
      }),
    ).toMatchSnapshot();
  });
});

describe("createMessageHandler", () => {
  it("works", () => {
    const mockHandler = jest.fn();
    const logger = createMessageHandler(mockHandler);
    logger(ROUTE_ID, "test-msg");
    expect(mockHandler).toHaveBeenCalledWith("<Route> test-msg");
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
