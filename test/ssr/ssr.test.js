import cheerio from "cheerio";
// eslint-disable-next-line import/extensions, import/no-unresolved
import app from "./dist/App";

const createSelector = testId => `[data-testid="${testId}"]`;

const render = url => {
	const { html } = app.render({ url });
	return testId => cheerio.load(html)(createSelector(testId));
};

describe("ssr", () => {
	describe("basic setup", () => {
		it("should display Home component", () => {
			const $ = render("/");
			const home = $("home");
			expect(home.length).toBe(1);
		});

		it("should display About component", () => {
			const $ = render("/about");
			const about = $("about");
			expect(about.length).toBe(1);
		});

		it("should display Blog component", () => {
			const $ = render("/blog");
			const blog = $("blog");
			expect(blog.length).toBe(1);
		});

		it("should add aria-current attribute to active link", () => {
			const $home = render("/");
			const homeLink = $home("link-home");
			expect(homeLink.attr("aria-current")).toBe("page");
			const $about = render("/about");
			const aboutLink = $about("link-about");
			expect(aboutLink.attr("aria-current")).toBe("page");
		});
	});

	describe("nested routes", () => {
		it("should display first nested component", () => {
			const $ = render("/blog/first");
			const first = $("blog-first");
			expect(first.length).toBe(1);
		});

		it("should display second nested component", () => {
			const $ = render("/blog/second");
			const second = $("blog-second");
			expect(second.length).toBe(1);
		});

		it("should display params", () => {
			const $ = render("/blog/id123");
			const params = $("blog-params");
			expect(params.length).toBe(1);
			expect(params.text()).toBe("id123");
		});
	});

	describe("hooks", () => {
		it("should display correct location", () => {
			const $ = render("/hooks/id123/rest?search=456#hash-anchor");
			const pathname = $("hooks-location-pathname").text();
			const search = $("hooks-location-search").text();
			const hash = $("hooks-location-hash").text();
			expect(pathname).toBe("/hooks/id123/rest");
			expect(search).toBe("?search=456");
			expect(hash).toBe("#hash-anchor");
		});

		it("should match correctly", () => {
			const $ = render("/hooks/id123/restId/rest");
			const relId = $("hooks-match-rel-id").text();
			const relSplash = $("hooks-match-rel-splash").text();
			const absId = $("hooks-match-abs-id").text();
			const absSplash = $("hooks-match-abs-splash").text();
			expect(relId).toBe("restId");
			expect(relSplash).toBe("rest");
			expect(absId).toBe("id123");
			expect(absSplash).toBe("restId/rest");
		});

		it("should display correct params", () => {
			const $ = render("/hooks/id123/rest");
			const id = $("hooks-params-id").text();
			const splash = $("hooks-params-splash").text();
			expect(id).toBe("id123");
			expect(splash).toBe("rest");
		});
	});
});
