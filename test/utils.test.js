import { pick, match, resolve, combinePaths, resolveLink } from "../src/utils";
import { testRoutes } from "./testRoutes";

describe("pick", () => {
  it("picks root over dynamic", () => {
    let routes = [
      { meta: "Root", fullPath: "/" },
      { meta: "Dynamic", fullPath: ":foo" },
    ];
    expect(pick(routes, "/").route.meta).toBe("Root");
  });

  it("a bunch of scenarios", () => {
    expect(pick(testRoutes, "/").route.meta).toBe("Root");
    expect(pick(testRoutes, "/groups/main/users/me").route.meta).toBe(
      "MainGroupMe",
    );
    expect(pick(testRoutes, "/groups/123/users/456").route.meta).toBe(
      "GroupUser",
    );
    expect(pick(testRoutes, "/one/two/three/four/five").route.meta).toBe(
      "Fiver",
    );
    expect(pick(testRoutes, "/groups/main/users").route.meta).toBe(
      "MainGroupUsers",
    );
    expect(pick(testRoutes, "/groups/123/users").route.meta).toBe("GroupUsers");
    expect(pick(testRoutes, "/groups/main").route.meta).toBe("MainGroup");
    expect(pick(testRoutes, "/groups/123").route.meta).toBe("Group");
    expect(pick(testRoutes, "/groups").route.meta).toBe("Groups");
    expect(pick(testRoutes, "/files/some/long/path").route.meta).toBe(
      "FilesDeep",
    );
    expect(pick(testRoutes, "/files").route.meta).toBe("Files");
    expect(pick(testRoutes, "/no/where").route.meta).toBe("Default");
  });

  it("pick /*", () => {
    expect(pick([{ fullPath: "/*" }], "/whatever/else")).toMatchSnapshot();
  });

  it("pick return value", () => {
    expect(pick(testRoutes, "/one/two/three/four/five")).toMatchSnapshot();
  });

  it("splat return value", () => {
    expect(pick(testRoutes, "/files/some/deep/path")).toMatchSnapshot();
  });

  it("dynamic segments + splat return value", () => {
    const routes = [{ fullPath: "/users/:userId/files/*" }];
    const matchedRoute = pick(routes, "/users/ryan/files/some/deep/path");
    expect(matchedRoute.params).toEqual({
      userId: "ryan",
      "*": "some/deep/path",
    });
  });
});

describe("match", () => {
  it("creates correct route data", () => {
    const matchedRoute = match({ fullPath: "/foo", meta: "Foo" }, "/foo");
    expect(matchedRoute.route.meta).toBe("Foo");
    expect(matchedRoute.params).toEqual({});
    expect(matchedRoute.uri).toBe("/foo");
  });

  it("matches params", () => {
    const matchedRoute = match({ fullPath: "/foo/:bar" }, "/foo/hello");
    expect(matchedRoute.params).toEqual({ bar: "hello" });
    expect(matchedRoute.uri).toBe("/foo/hello");
  });

  it("matches splat", () => {
    const matchedRoute = match({ fullPath: "/foo/*" }, "/foo/hello");
    expect(matchedRoute.params).toEqual({ "*": "hello" });
    expect(matchedRoute.uri).toBe("/foo");
  });

  it("matches named splat", () => {
    const matchedRoute = match({ fullPath: "/foo/*splat" }, "/foo/hello");
    expect(matchedRoute.params).toEqual({ splat: "hello" });
    expect(matchedRoute.uri).toBe("/foo");
  });

  it("strips search", () => {
    const paramRoute = match({ fullPath: "/foo/:bar" }, "/foo/hello?baz=123");
    expect(paramRoute.uri).toBe("/foo/hello");
    const splatRoute = match({ fullPath: "/foo/*" }, "/foo/hello?baz=123");
    expect(splatRoute.uri).toBe("/foo");
    const namedRoute = match({ fullPath: "/foo/*splat" }, "/foo/hello?baz=123");
    expect(namedRoute.uri).toBe("/foo");
  });
});

describe("resolve", () => {
  it("works with a / base", () => {
    expect(resolve("contacts/ryan", "/")).toEqual("/contacts/ryan");
  });

  it("a bunch of stuff", () => {
    expect(resolve("/somewhere/else", "/users/123")).toEqual("/somewhere/else");
    expect(resolve("settings", "/users/123")).toEqual("/users/123/settings");
    expect(resolve("../../one/../two/.././three", "/a/b/c/d/e/f/g")).toEqual(
      "/a/b/c/d/e/three",
    );
    expect(resolve("./", "/users/123")).toEqual("/users/123");
    expect(resolve(".", "/users/123")).toEqual("/users/123");
    expect(resolve("../", "/users/123")).toEqual("/users");
    expect(resolve("../..", "/users/123")).toEqual("/");
    expect(resolve("../.././3", "/u/1/g/4")).toEqual("/u/1/3");
    expect(resolve("../.././s?beef=boof", "/u/1/g/4")).toEqual(
      "/u/1/s?beef=boof",
    );
    expect(resolve("../.././3", "/u/1/g/4?beef=boof")).toEqual("/u/1/3");
    expect(resolve("stinky/barf", "/u/1/g/4")).toEqual("/u/1/g/4/stinky/barf");
    expect(resolve("?some=query", "/users/123?some=thing")).toEqual(
      "/users/123?some=query",
    );
    expect(resolve("/groups?some=query", "/users?some=thing")).toEqual(
      "/groups?some=query",
    );
  });
});

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

describe("resolveLink", () => {
  it("relative", () => {
    expect(resolveLink("relative", "/", "/currentBase")).toBe(
      "/currentBase/relative",
    );
  });

  it("relative, no slashes", () => {
    expect(resolveLink("relative", "", "currentBase")).toBe(
      "/currentBase/relative",
    );
  });

  it("absolute", () => {
    expect(resolveLink("/absolute", "/", "/currentBase")).toBe("/absolute");
  });

  it("absolute, no slashes", () => {
    expect(resolveLink("/absolute", "/", "currentBase")).toBe("/absolute");
  });

  it("absolute with base", () => {
    expect(resolveLink("/absolute", "/base", "/currentBase")).toBe(
      "/base/absolute",
    );
  });

  it("absolute with base ..", () => {
    expect(resolveLink("../relative", "/base", "/currentBase")).toBe(
      "/relative",
    );
  });

  it("absolute ..", () => {
    expect(resolveLink("../relative", "/", "/currentBase")).toBe("/relative");
  });
});
