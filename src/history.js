/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

function getLocation(source) {
  return {
    ...source.location,
    pathname: encodeURI(decodeURI(source.location.pathname)),
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || "initial",
  };
}

function createKey() {
  return Math.random()
    .toString(36)
    .replace(".", "")
    .substring(1);
}

function createHistory(source) {
  let listeners = [];
  let location = getLocation(source);

  return {
    get location() {
      return location;
    },
    listen(listener) {
      listeners.push(listener);

      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };

      source.addEventListener("popstate", popstateListener);

      return () => {
        source.removeEventListener("popstate", popstateListener);
        listeners = listeners.filter(fn => fn !== listener);
      };
    },
    /**
     * Navigate to a new absolute route.
     *
     * @param {string|number} to The path to navigate to.
     *
     * If `to` is a number we will navigate to the stack entry index + `to`
     * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
     * @param {Object} options
     * @param {*} [options.state] The state will be accessible through `location.state`
     * @param {boolean} [options.replace=false] Replace the current entry in the history
     * stack, instead of pushing on a new one
     */
    navigate(to, { state, replace = false } = {}) {
      if (typeof to === "number") {
        source.history.go(to);
      } else {
        const keyedState = { ...state, key: createKey() };
        // try...catch iOS Safari limits to 100 pushState calls
        try {
          if (replace) {
            source.history.replaceState(keyedState, "", to);
          } else {
            source.history.pushState(keyedState, "", to);
          }
        } catch (e) {
          source.location[replace ? "replace" : "assign"](to);
        }
      }

      location = getLocation(source);
      listeners.forEach(listener => listener({ location, action: "PUSH" }));
    },
  };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
  let index = 0;
  let stack = [{ pathname: initialPathname, search: "", state: null }];

  const createStackFrame = (state, uri) => {
    const [pathname, queryParams = ""] = uri.split("?");
    // Browsers add a "?" to the start of a search if there is any.
    // Otherwise they return ""
    const search = queryParams.length ? `?${queryParams}` : "";
    return { pathname, search, state };
  };

  return {
    get location() {
      return stack[index];
    },
    // eslint-disable-next-line no-unused-vars
    addEventListener(name, fn) {},
    // eslint-disable-next-line no-unused-vars
    removeEventListener(name, fn) {},
    history: {
      get index() {
        return index;
      },
      get state() {
        return stack[index].state;
      },
      pushState(state, title, uri) {
        index++;
        // Throw away anything in the stack with an index greater than the current index.
        // This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
        // If we call `go(+n)` the stack entries with an index greater than the current index can
        // be reused.
        // However, if we navigate to a path, instead of a number, we want to create a new branch
        // of navigation.
        stack = stack.slice(0, index);
        stack.push(createStackFrame(state, uri));
      },
      replaceState(state, title, uri) {
        stack[index] = createStackFrame(state, uri);
      },
      go(to) {
        let newIndex = index + to;
        if (newIndex < 0 || newIndex > stack.length - 1) {
          return;
        }
        index = newIndex;
      },
    },
  };
}

// Global history uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement,
);
const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
const { navigate } = globalHistory;

export { globalHistory, navigate, createHistory, createMemorySource };
