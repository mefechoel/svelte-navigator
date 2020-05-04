import { createMemorySource, createHistory } from "../src/history";

describe("createMemorySource", () => {
  it("creates a memory source with correct pathname (no initialPathname)", () => {
    const testHistory = createMemorySource();
    expect(testHistory.location.pathname).toBe("/");
    expect(testHistory.location.search).toBe("");
  });

  it("creates a memory source with correct pathname", () => {
    const testHistory = createMemorySource("/test");
    expect(testHistory.location.pathname).toBe("/test");
  });

  it("creates a memory source with search", () => {
    const testHistory = createMemorySource("/test?foo=bar");
    expect(testHistory.location.search).toBe("?foo=bar");
  });

  it("creates a memory source with initial state = null", () => {
    const testHistory = createMemorySource();
    expect(testHistory.location.state).toBe(null);
  });
});

describe("createHistory", () => {
  it("should have location with pathname", () => {
    const mockSource = {
      history: {},
      location: {
        pathname: "/page",
        search: "",
        hash: "",
      },
    };

    const history = createHistory(mockSource);

    expect(history.location.pathname).toEqual("/page");
  });

  it("should encode location pathname", () => {
    const mockSource = {
      history: {},
      location: {
        pathname: "/påge",
        search: "",
        hash: "",
      },
    };

    const history = createHistory(mockSource);

    expect(history.location.pathname).toEqual("/p%C3%A5ge");
  });

  it("should not encode location pathname if it is already encoded", () => {
    const mockSource = {
      history: {},
      location: {
        pathname: "/p%C3%A5ge",
        search: "",
        hash: "",
      },
    };

    const history = createHistory(mockSource);

    expect(history.location.pathname).toEqual("/p%C3%A5ge");
  });
});

describe("navigate", () => {
  it("should go to url", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    expect(history.location.pathname).toBe("/two");
  });

  it("should go to previous route", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    history.navigate(-1);
    expect(history.location.pathname).toBe("/one");
  });

  it("should go to next route", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    history.navigate(-1);
    history.navigate(1);
    expect(history.location.pathname).toBe("/two");
  });

  it("should ignore calls to go if index out of bounds (go(1))", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    history.navigate(-1);
    history.navigate(1);
    history.navigate(1);
    history.navigate(1);
    expect(history.location.pathname).toBe("/two");
  });

  it("should ignore calls to go if index out of bounds (go(-1))", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    history.navigate(-1);
    history.navigate(-1);
    history.navigate(-1);
    expect(history.location.pathname).toBe("/one");
  });

  it("should discard stack with `i > index` when navigating to a new path", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    history.navigate(-1);
    history.navigate("/three");
    expect(history.location.pathname).toBe("/three");
  });

  it("should replace the pathname current stack entry", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    expect(mockSource.location.pathname).toBe("/one");
    history.navigate("/two", { replace: true });
    expect(mockSource.location.pathname).toBe("/two");
  });

  it("should keep the stack entry length", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    expect(mockSource.entries.length).toBe(1);
    history.navigate("/two", { replace: true });
    expect(mockSource.entries.length).toBe(1);
  });

  it("should replace the state of the current stack entry", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two", { state: { n: 0 }, replace: true });
    expect(mockSource.history.state).toEqual(expect.objectContaining({ n: 0 }));
    history.navigate("/three", { state: { n: 1 }, replace: true });
    expect(mockSource.history.state).toEqual(expect.objectContaining({ n: 1 }));
  });
});

describe("search", () => {
  it("should have a proper search", () => {
    const testHistory = createHistory(createMemorySource());
    testHistory.navigate("/?asdf");
    expect(testHistory.location.search).toEqual("?asdf");
  });

  it("should have a proper search", () => {
    const testHistory = createHistory(createMemorySource());
    testHistory.navigate("/?asdf", { replace: true });
    expect(testHistory.location.search).toEqual("?asdf");
  });
});

describe("listen", () => {
  it("should dispatch PUSH on navigate", () => {
    const mockSource = createMemorySource();
    const history = createHistory(mockSource);
    const mockListener = jest.fn();
    history.listen(mockListener);
    history.navigate("/path");
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "PUSH",
        location: expect.objectContaining({ pathname: "/path" }),
      }),
    );
  });

  it("should dispatch REPLACE on navigate with replace: true", () => {
    const mockSource = createMemorySource();
    const history = createHistory(mockSource);
    const mockListener = jest.fn();
    history.listen(mockListener);
    history.navigate("/path", { replace: true });
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "REPLACE",
        location: expect.objectContaining({ pathname: "/path" }),
      }),
    );
  });

  it("should dispatch POP on navigate with number", () => {
    const mockSource = createMemorySource("/one");
    const history = createHistory(mockSource);
    history.navigate("/two");
    const mockListener = jest.fn();
    history.listen(mockListener);
    history.navigate(-1);
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "POP",
        location: expect.objectContaining({ pathname: "/one" }),
      }),
    );
  });

  it("should remove listener correctly", () => {
    const mockSource = createMemorySource();
    const history = createHistory(mockSource);
    const mockListener = jest.fn();
    const unlisten = history.listen(mockListener);
    history.navigate("/one");
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "PUSH",
        location: expect.objectContaining({ pathname: "/one" }),
      }),
    );
    unlisten();
    history.navigate("/two");
    expect(mockListener).not.toHaveBeenCalledWith(
      expect.objectContaining({
        action: "PUSH",
        location: expect.objectContaining({ pathname: "/two" }),
      }),
    );
  });

  it("should register 'popstate' listener", () => {
    const mockSource = {
      addEventListener: jest.fn(),
      history: {},
      location: {
        pathname: "/",
        search: "",
        hash: "",
      },
    };
    const history = createHistory(mockSource);
    history.listen(() => {});
    expect(mockSource.addEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function),
    );
  });

  it("should forward native 'popstate' events", () => {
    const listeners = [];
    const mockSource = {
      addEventListener: (event, listener) => listeners.push(listener),
      history: {},
      location: {
        pathname: "/",
        search: "",
        hash: "",
      },
    };
    const history = createHistory(mockSource);
    const mockListener = jest.fn();
    history.listen(mockListener);
    expect(listeners.length).toBe(1);
    listeners[0]();
    expect(mockListener).toHaveBeenCalledWith({
      action: "POP",
      location: expect.objectContaining(mockSource.location),
    });
  });

  it("should remove 'popstate' listener on unlisten", () => {
    const listeners = [];
    const mockSource = {
      addEventListener: (event, listener) => listeners.push(listener),
      removeEventListener: jest.fn(),
      history: {},
      location: {
        pathname: "/",
        search: "",
        hash: "",
      },
    };
    const history = createHistory(mockSource);
    const mockListener = jest.fn();
    const unlisten = history.listen(mockListener);
    unlisten();
    expect(mockSource.removeEventListener).toHaveBeenCalledWith(
      "popstate",
      listeners[0],
    );
  });
});

describe("Safari throw on history methods", () => {
  it("should catch error thrown in history.pushState", () => {
    const mockSource = {
      history: {
        pushState: () => {
          throw new Error("gotcha");
        },
      },
      location: {
        pathname: "/",
        search: "",
        hash: "",
        assign: jest.fn(),
      },
    };
    const history = createHistory(mockSource);
    expect(() => history.navigate("/error")).not.toThrow();
    expect(mockSource.location.assign).toHaveBeenCalled();
  });

  it("should catch error thrown in history.replaceState", () => {
    const mockSource = {
      history: {
        replaceState: () => {
          throw new Error("gotcha");
        },
      },
      location: {
        pathname: "/",
        search: "",
        hash: "",
        replace: jest.fn(),
      },
    };
    const history = createHistory(mockSource);
    expect(() => history.navigate("/error", { replace: true })).not.toThrow();
    expect(mockSource.location.replace).toHaveBeenCalled();
  });
});
