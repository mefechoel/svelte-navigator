/// <reference types="cypress" />

function getByTestId(id) {
  return cy.get(`[data-testid="${id}"]`);
}

function assertPath(expectedPath) {
  return cy
    .window()
    .then(win => win.location.pathname)
    .should("be", expectedPath);
}

function appState(field) {
  return cy.window().then(win => (field ? win.appState[field] : win.appState));
}

function memoryBState(field) {
  return cy
    .window()
    .then(win => (field ? win.memoryBState[field] : win.memoryBState));
}

function go(to) {
  return cy.window().then(
    win =>
      new Cypress.Promise(res => {
        function handler() {
          win.removeEventListener("popstate", handler);
          res();
        }
        win.addEventListener("popstate", handler);
        win.history.go(to);
      }),
  );
}

function objectMatches(partialObject, target, { not = false } = {}) {
  Object.entries(partialObject).forEach(([key, value]) => {
    if (not) {
      expect(target).not.to.have.property(key, value);
    } else {
      expect(target).to.have.property(key, value);
    }
  });
}

function stateIncludes(
  partialObject,
  { stateGetter = appState, not = false } = {},
) {
  stateGetter("location").then(location =>
    objectMatches(partialObject, location.state, { not }),
  );
}

function locationIncludes(
  partialObject,
  { stateGetter = appState, not = false } = {},
) {
  stateGetter("location").then(location =>
    objectMatches(partialObject, location, { not }),
  );
}

describe("Router", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Navigation", () => {
    describe("Root", () => {
      it("absolute and relative link work the same in root", () => {
        getByTestId("route-home").should("be.visible");
        getByTestId("route-about").should("not.be.visible");

        getByTestId("link-about-rel").click();
        getByTestId("route-about").should("be.visible");
        assertPath("/about");

        getByTestId("link-app-home").click();

        getByTestId("route-home").should("be.visible");
        getByTestId("route-about").should("not.be.visible");
        assertPath("/");

        getByTestId("link-about-abs").click();
        getByTestId("route-about").should("be.visible");
        assertPath("/about");
      });

      it("link resolution stops at base", () => {
        getByTestId("link-about-rel").click();
        assertPath("/about");

        getByTestId("link-app-home").click();

        getByTestId("route-home").should("be.visible");
        assertPath("/");

        getByTestId("link-about-rel").click();
        assertPath("/about");

        getByTestId("link-back-home").click();

        getByTestId("route-home").should("be.visible");
        assertPath("/");
      });

      it("renders default route, when no path could be matched", () => {
        getByTestId("link-nowhere").click();
        assertPath("/nowhere");
        getByTestId("route-home").should("not.be.visible");
        getByTestId("route-default").should("be.visible");
      });
    });

    describe("Nested Router", () => {
      beforeEach(() => {
        getByTestId("link-blog").click();
      });

      it("relative link works in route", () => {
        getByTestId("link-app-blog-svelte-rel").should("be.visible");
        assertPath("/blog");

        getByTestId("link-app-blog-svelte-rel").click();
        getByTestId("route-blog-svelte").should("be.visible");
        assertPath("/blog/svelte");
      });

      it("absolute link works in route", () => {
        getByTestId("link-app-blog-svelte-abs").should("be.visible");
        assertPath("/blog");

        getByTestId("link-app-blog-svelte-abs").click();
        getByTestId("route-blog-svelte").should("not.be.visible");
        assertPath("/svelte");
      });

      it("absolute and relative link work in nested root", () => {
        getByTestId("link-blog-svelte-rel").click();
        getByTestId("route-blog-svelte").should("be.visible");
        assertPath("/blog/svelte");

        getByTestId("link-blog-home").click();

        getByTestId("route-blog-home").should("be.visible");
        getByTestId("route-blog-svelte").should("not.be.visible");
        assertPath("/blog");

        getByTestId("link-blog-svelte-abs").click();
        getByTestId("route-blog-svelte").should("not.be.visible");
        getByTestId("route-default").should("be.visible");
        assertPath("/svelte");
      });

      it("breaks out of router scope using ../", () => {
        getByTestId("link-blog-app-home").click();
        assertPath("/");
      });

      it("resolves path param", () => {
        getByTestId("link-blog-id").click();
        cy.contains("ARTICLE_ID:123").should("be.visible");
        assertPath("/blog/article/123");
      });

      it("resolves splat", () => {
        getByTestId("link-blog-splat").click();
        cy.contains("SPLAT:123").should("be.visible");
        assertPath("/blog/other/123");
      });

      it("resolves named splat", () => {
        getByTestId("link-blog-named-splat").click();
        cy.contains("NAMED_SPLAT:123").should("be.visible");
        assertPath("/blog/whatever/123");
      });

      it("renders default if no other route matches", () => {
        cy.visit("/blog/whereami/idontknow");
        getByTestId("route-blog-default").should("be.visible");
        assertPath("/blog/whereami/idontknow");
      });
    });

    describe("Nested Route", () => {
      it("renders nested index page '/'", () => {
        getByTestId("link-dashboard-mark").click();
        assertPath("/dashboard/mark");
        cy.contains("Hello mark!");
      });

      it("renders nested page with parameter", () => {
        getByTestId("link-dashboard-mark").click();
        getByTestId("link-dashboard-article-987").click();
        assertPath("/dashboard/mark/article/987");
        cy.contains("Article 987");
      });

      it("re-resolves links when parameters change", () => {
        getByTestId("link-dashboard-mark").click();
        assertPath("/dashboard/mark");

        getByTestId("link-dashboard-article-987").click();
        assertPath("/dashboard/mark/article/987");

        getByTestId("link-dashboard-paul").click();
        assertPath("/dashboard/paul");

        getByTestId("link-dashboard-article-987").click();
        assertPath("/dashboard/paul/article/987");
      });
    });
  });

  describe("State", () => {
    it("pushes state from Link prop", () => {
      getByTestId("link-state").click();
      assertPath("/");
      stateIncludes({ value: "test-state" });
    });

    it("pushes to the stack, when Link has no prop replace", () => {
      getByTestId("link-nowhere").click();
      getByTestId("link-about-rel").click();
      assertPath("/about");
      getByTestId("route-about").should("be.visible");
      go(-1);
      assertPath("/nowhere");
      getByTestId("route-default").should("be.visible");
    });

    it("replaces the current stack entry, when Link has prop replace", () => {
      getByTestId("link-nowhere").click();
      getByTestId("link-about-replace").click();
      assertPath("/about");
      getByTestId("route-about").should("be.visible");
      go(-1);
      assertPath("/");
      getByTestId("route-home").should("be.visible");
    });

    it("pushes the current state, when Link has no prop replace", () => {
      getByTestId("link-nowhere").click();
      getByTestId("link-state").click();
      assertPath("/");
      stateIncludes({ value: "test-state" });
      getByTestId("link-about-push-state").click();
      assertPath("/about");
      stateIncludes({ value: "test-push-state" });
      go(-1);
      assertPath("/");
      stateIncludes({ value: "test-state" });
    });
  });

  describe("Link", () => {
    it("replaces the current state, when Link has prop replace", () => {
      getByTestId("link-nowhere").click();
      getByTestId("link-state").click();
      assertPath("/");
      stateIncludes({ value: "test-state" });
      getByTestId("link-about-replace-state").click();
      assertPath("/about");
      stateIncludes({ value: "test-replace-state" });
      go(-1);
      assertPath("/nowhere");
      stateIncludes({ value: "test-state" }, { not: true });
    });

    it("adds aria-current attribute to active link", () => {
      getByTestId("link-about-rel").should(
        "not.have.attr",
        "aria-current",
        "page",
      );
      getByTestId("link-about-abs").should(
        "not.have.attr",
        "aria-current",
        "page",
      );
      getByTestId("link-about-rel").click();
      getByTestId("link-about-rel").should("have.attr", "aria-current", "page");
      getByTestId("link-about-abs").should("have.attr", "aria-current", "page");
    });

    it("spreads props to <a />, when has no getProps prop", () => {
      getByTestId("link-props").should("have.attr", "data-has-attr");
    });

    it("merges spread props and getProps in <a />", () => {
      getByTestId("link-get-props").should("have.attr", "data-spread-attr");
      getByTestId("link-get-props").should("have.attr", "data-has-attr");
    });

    it("discards duplicates in spread props, keeping getProps", () => {
      getByTestId("link-get-props").should(
        "have.attr",
        "data-duplicate-attr",
        "getProps",
      );
    });

    it("merges spread props and getProps in <a />", () => {
      getByTestId("link-get-props").should("have.attr", "data-spread-attr");
      getByTestId("link-get-props").should("have.attr", "data-has-attr");
    });

    it("spreads getProps to <a />, when has getProps prop", () => {
      getByTestId("link-get-props").should("have.attr", "data-has-attr");
    });
  });

  describe("Hooks", () => {
    describe("useLinkResolve", () => {
      it("works", () => {
        getByTestId("link-blog").click();
        getByTestId("link-blog-resolve").click();

        cy.window().then(win =>
          objectMatches(
            {
              absHome: "/",
              absSomething: "/something",
              relSomething: "/blog/resolve/something",
              relBackSomething: "/blog/something",
              relAppSomething: "/something",
              relPastAppSomething: "/something",
              blogRoot: "/blog",
              appRoot: "/",
              appPastRoot: "/",
            },
            win.resolveMap,
          ),
        );
      });
    });

    describe("useNavigate", () => {
      it("works", () => {
        getByTestId("link-blog").click();
        getByTestId("link-blog-navigate").click();

        cy.window().then(({ navigate }) => {
          navigate("/");
          assertPath("/blog");

          navigate("/something");
          assertPath("/blog/something");

          navigate("something");
          assertPath("/blog/navigate/something");

          navigate("../something");
          assertPath("/blog/something");

          navigate("../../something");
          assertPath("/something");

          navigate("../../../something");
          assertPath("/something");

          navigate("..");
          assertPath("/blog");

          navigate("../..");
          assertPath("/");

          navigate(-1);
          assertPath("/blog");

          navigate(1);
          assertPath("/");

          navigate("/");
          navigate("/something", { replace: true });
          assertPath("/");
        });
      });
    });

    describe("useMatch", () => {
      const assertMatch = (field, expected) =>
        cy
          .window()
          .then(({ useMatch }) => useMatch[field] && useMatch[field].params)
          .should("deep.equal", expected);

      it("works", () => {
        getByTestId("link-blog-match-empty").click();
        assertMatch("relMatch", null);
        assertMatch("absMatch", null);

        getByTestId("link-blog-match-to").click();
        assertMatch("relMatch", { to: "some-path", somewhere: "" });
        assertMatch("absMatch", { to: "some-path", somewhere: "" });

        getByTestId("link-blog-match-to-splat").click();
        assertMatch("relMatch", { to: "some-path", somewhere: "some-splat" });
        assertMatch("absMatch", { to: "some-path", somewhere: "some-splat" });
      });
    });
  });

  describe("actions", () => {
    beforeEach(() => {
      cy.window().then(win => {
        // eslint-disable-next-line no-param-reassign
        win.customNavigateCalled = false;
      });
    });

    describe("links", () => {
      it("pushes stack entry by default", () => {
        getByTestId("link-nowhere").click();
        getByTestId("action-links-about").click();
        assertPath("/about");
        getByTestId("route-about").should("be.visible");
        go(-1);
        assertPath("/nowhere");
        getByTestId("route-default").should("be.visible");
      });

      it("replaces stack entry when has replace prop", () => {
        getByTestId("link-nowhere").click();
        getByTestId("action-links-about-replace").click();
        assertPath("/about");
        getByTestId("route-about").should("be.visible");
        go(-1);
        assertPath("/");
        getByTestId("route-home").should("be.visible");
      });

      it("uses custom navigate function when supplied", () => {
        getByTestId("action-links-custom-navigate").click();
        cy.window()
          .then(w => w.customNavigateCalled)
          .should("be.true");
      });
    });

    describe("link", () => {
      it("pushes stack entry by default", () => {
        getByTestId("link-nowhere").click();
        getByTestId("action-link-about").click();
        assertPath("/about");
        getByTestId("route-about").should("be.visible");
        go(-1);
        assertPath("/nowhere");
        getByTestId("route-default").should("be.visible");
      });

      it("replaces stack entry when has replace prop", () => {
        getByTestId("link-nowhere").click();
        getByTestId("action-link-about-replace").click();
        assertPath("/about");
        getByTestId("route-about").should("be.visible");
        go(-1);
        assertPath("/");
        getByTestId("route-home").should("be.visible");
      });

      it("uses custom navigate function when supplied", () => {
        getByTestId("action-link-custom-navigate").click();
        cy.window()
          .then(w => w.customNavigateCalled)
          .should("be.true");
      });
    });
  });

  describe("Memory History", () => {
    it("works", () => {
      getByTestId("route-memory-a-home").should("be.visible");
      getByTestId("route-memory-a-about").should("not.be.visible");

      getByTestId("link-memory-a-about").click();
      getByTestId("route-memory-a-about").should("be.visible");

      getByTestId("link-memory-a-nowhere").click();
      getByTestId("route-memory-a-default").should("be.visible");

      getByTestId("link-memory-a-home").click();
      getByTestId("route-memory-a-home").should("be.visible");
    });
  });

  describe("Basepath", () => {
    const pathnameMatches = (pathname, { not } = {}) =>
      locationIncludes({ pathname }, { stateGetter: memoryBState, not });

    it("works", () => {
      getByTestId("route-memory-b-home").should("be.visible");
      getByTestId("route-memory-b-about").should("not.be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-about").click();
      getByTestId("route-memory-b-about").should("be.visible");
      pathnameMatches("/about");

      getByTestId("link-memory-b-home-replace").click();
      getByTestId("route-memory-b-home").should("be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-nowhere").click();
      getByTestId("route-memory-b-default").should("be.visible");
      pathnameMatches("/nowhere");

      getByTestId("link-memory-b-home").click();
      getByTestId("route-memory-b-home").should("be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-blog").click();
      getByTestId("route-memory-blog-home").should("be.visible");
      pathnameMatches("/blog");

      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("route-memory-blog-svelte").should("be.visible");
      pathnameMatches("/blog/svelte");

      getByTestId("link-memory-blog-app-home-l1").click();
      getByTestId("route-memory-b-home").should("be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-blog").click();
      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("link-memory-blog-app-home-l2").click();
      getByTestId("route-memory-b-home").should("be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-blog").click();
      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("link-memory-blog-app-home-l3").click();
      getByTestId("route-memory-b-home").should("be.visible");
      pathnameMatches("/");

      getByTestId("link-memory-b-blog").click();
      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("link-memory-blog-somewhere-l1").click();
      pathnameMatches("/somewhere");

      getByTestId("link-memory-b-blog").click();
      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("link-memory-blog-somewhere-l2").click();
      pathnameMatches("/somewhere");

      getByTestId("link-memory-b-blog").click();
      getByTestId("link-memory-blog-svelte-rel").click();
      getByTestId("link-memory-blog-somewhere-l3").click();
      pathnameMatches("/somewhere");
    });
  });

  describe("A11y", () => {
    const assertFocusElement = testId =>
      cy
        .window()
        .then(win => win.document.activeElement)
        .should("have.attr", "data-testid", testId);

    it("focuses appropriate heading on navigation", () => {
      getByTestId("a11y-link-b").click();
      assertFocusElement("a11y-route-b");
    });

    it("focuses appropriate nested heading navigation to inner route", () => {
      getByTestId("a11y-link-c").click();
      assertFocusElement("a11y-route-c");
    });

    it("focuses custom focus element (useFocus, sync)", () => {
      getByTestId("a11y-link-d").click();
      assertFocusElement("a11y-route-d-focus");
    });

    it("focuses custom focus element (useFocus, async)", () => {
      getByTestId("a11y-link-e").click();
      getByTestId("a11y-route-e-focus");
      assertFocusElement("a11y-route-e-focus");
    });

    it("announces navigation to screen reader users", () => {
      getByTestId("a11y-link-b").click();
      // eslint-disable-next-line quotes
      cy.get('[role="status"]')
        .last()
        .invoke("text")
        .should("equal", "Navigated to /b");
    });
  });
});
