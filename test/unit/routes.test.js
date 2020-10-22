import {
	pick,
	match,
	resolve,
	resolveLink,
	normalizeLocation,
} from "../../src/routes";
import { testRoutes } from "./testRoutes";

describe("pick", () => {
	it("picks root over dynamic", () => {
		const routes = [
			{ meta: "Root", fullPath: "/" },
			{ meta: "Dynamic", fullPath: ":foo" },
		];
		expect(pick(routes, "/").meta).toBe("Root");
	});

	it("a bunch of scenarios", () => {
		const assertPick = (path, expectedName) =>
			expect(pick(testRoutes, path).meta).toBe(expectedName);
		assertPick("/", "Root");
		assertPick("/groups/main/users/me", "MainGroupMe");
		assertPick("/groups/123/users/456", "GroupUser");
		assertPick("/one/two/three/four/five", "Fiver");
		assertPick("/groups/main/users", "MainGroupUsers");
		assertPick("/groups/123/users", "GroupUsers");
		assertPick("/groups/main", "MainGroup");
		assertPick("/groups/123", "Group");
		assertPick("/groups", "Groups");
		assertPick("/files/some/long/path", "FilesDeep");
		assertPick("/files", "Files");
		assertPick("/no/where", "Default");
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
		expect(matchedRoute.meta).toBe("Foo");
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

describe("resolveLink", () => {
	it("relative", () => {
		expect(resolveLink("relative", "/currentBase", "/")).toBe(
			"/currentBase/relative",
		);
		expect(resolveLink("relative", "/currentBase", "/appBase")).toBe(
			"/appBase/currentBase/relative",
		);
	});

	it("relative, no slashes", () => {
		expect(resolveLink("relative", "currentBase", "/")).toBe(
			"/currentBase/relative",
		);
		expect(resolveLink("relative", "currentBase", "/appBase")).toBe(
			"/appBase/currentBase/relative",
		);
	});

	it("absolute", () => {
		expect(resolveLink("/absolute", "/currentBase", "/")).toBe("/absolute");
		expect(resolveLink("/absolute", "/currentBase", "/appBase")).toBe(
			"/appBase/absolute",
		);
	});

	it("absolute, no slashes", () => {
		expect(resolveLink("/absolute", "currentBase", "/")).toBe("/absolute");
		expect(resolveLink("/absolute", "currentBase", "/appBase")).toBe(
			"/appBase/absolute",
		);
	});

	it("relative ..", () => {
		expect(resolveLink("../relative", "/currentBase", "/")).toBe("/relative");
		expect(resolveLink("../relative", "/currentBase", "/appBase")).toBe(
			"/appBase/relative",
		);
	});

	it("relative ../.. past root", () => {
		expect(resolveLink("../../relative", "/currentBase", "/")).toBe(
			"/relative",
		);
		expect(resolveLink("../../relative", "/currentBase", "/appBase")).toBe(
			"/appBase/relative",
		);
	});

	it("relative .. in scope", () => {
		expect(resolveLink("../relative", "/current/base", "/")).toBe(
			"/current/relative",
		);
		expect(resolveLink("../relative", "/current/base", "/appBase")).toBe(
			"/appBase/current/relative",
		);
	});

	it("/ -> basepath", () => {
		expect(resolveLink("/", "/currentBase", "/")).toBe("/");
		expect(resolveLink("/", "/currentBase", "/appBase")).toBe("/appBase");
	});
});

describe("normalizeLocation", () => {
	it("removes base", () => {
		const location = normalizeLocation(
			{ pathname: "/base/path/test-path" },
			"/base/path",
		);
		expect(location).toEqual(
			expect.objectContaining({ pathname: "/test-path" }),
		);
	});

	it("works when base == /", () => {
		const location = normalizeLocation({ pathname: "/test-path" }, "/");
		expect(location).toEqual(
			expect.objectContaining({ pathname: "/test-path" }),
		);
	});

	it("works when base == ''", () => {
		const location = normalizeLocation({ pathname: "/test-path" }, "");
		expect(location).toEqual(
			expect.objectContaining({ pathname: "/test-path" }),
		);
	});

	it("adds empty search and hash", () => {
		const location = normalizeLocation(
			{ pathname: "/base/path/test-path" },
			"/base/path",
		);
		expect(location).toEqual(expect.objectContaining({ search: "", hash: "" }));
	});

	it("throws when base paths don't match", () => {
		const getLocation = () =>
			normalizeLocation({ pathname: "/base/test-path" }, "/base/path");
		expect(getLocation).toThrow();
	});
});

// describe("createLocation", () => {
//   it("happy path", () => {
//     expect(createLocation("/path?search#hash")).toEqual({
//       pathname: "/path",
//       search: "?search",
//       hash: "#hash",
//     });
//     expect(createLocation("/path?search")).toEqual({
//       pathname: "/path",
//       search: "?search",
//       hash: "",
//     });
//     expect(createLocation("/path#hash")).toEqual({
//       pathname: "/path",
//       search: "",
//       hash: "#hash",
//     });
//   });

//   it("removes empty hash or search", () => {
//     expect(createLocation("/path?#hash")).toEqual({
//       pathname: "/path",
//       search: "",
//       hash: "#hash",
//     });
//     expect(createLocation("/path?search#")).toEqual({
//       pathname: "/path",
//       search: "?search",
//       hash: "",
//     });
//     expect(createLocation("/path?#")).toEqual({
//       pathname: "/path",
//       search: "",
//       hash: "",
//     });
//   });
// });
