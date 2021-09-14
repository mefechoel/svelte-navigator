/*
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 */

import { createLocation } from "./routes";
import { createGlobalId, isSSR, isNumber, addListener } from "./utils";
import { warn, NAVIGATE_ID } from "./warning";

const POP = "POP";
const PUSH = "PUSH";
const REPLACE = "REPLACE";

function getLocation(source) {
	return {
		...source.location,
		pathname: encodeURI(decodeURI(source.location.pathname)),
		state: source.history.state,
		_key: (source.history.state && source.history.state._key) || "initial",
	};
}

function createHistory(source) {
	let promptHandlers = [];
	let listeners = [];
	let location = getLocation(source);
	let action = POP;

	const notifyPromptHandlers = () => {
		for (let i = 0, l = promptHandlers.length; i < l; i++) {
			const promptHandler = promptHandlers[i];
			const result = promptHandler({ location, action });
			if (result !== undefined) {
				return result;
			}
		}
		return undefined;
	};
	const promptIfNecessary = () => {
		const message = notifyPromptHandlers();
		return message !== undefined
			? // eslint-disable-next-line no-alert
			  window.confirm(message)
			: true;
	};

	const notifyListeners = (listenerFns = listeners) =>
		listenerFns.forEach(listener => listener({ location, action }));

	let popstateUnlisten;
	const registerPopstateListener = () => {
		if (popstateUnlisten === undefined) {
			popstateUnlisten = addListener(source, "popstate", () => {
				if (promptIfNecessary()) {
					location = getLocation(source);
					action = POP;
					notifyListeners();
				} else {
					window.history.pushState(
						location.state,
						location.title,
						location.href,
					);
				}
			});
		}
	};
	const removePopstateListener = () => {
		if (popstateUnlisten !== undefined) {
			popstateUnlisten();
			popstateUnlisten = undefined;
		}
	};

	let beforeUnloadUnlisten;
	const registerBeforeUnloadListener = () => {
		if (beforeUnloadUnlisten === undefined) {
			beforeUnloadUnlisten = addListener(window, "beforeunload", e => {
				const message = notifyPromptHandlers();
				if (message !== undefined) {
					e.preventDefault();
					e.returnValue = message;
				}
			});
		}
	};
	const removeBeforeUnloadListener = () => {
		if (beforeUnloadUnlisten !== undefined) {
			beforeUnloadUnlisten();
			beforeUnloadUnlisten = undefined;
		}
	};

	return {
		get location() {
			return location;
		},
		prompt(promptHandler) {
			registerPopstateListener();
			registerBeforeUnloadListener();

			promptHandlers.push(promptHandler);

			return () => {
				promptHandlers = promptHandlers.filter(fn => fn !== promptHandler);
				if (promptHandlers.length === 0 && listeners.length === 0) {
					removePopstateListener();
					removeBeforeUnloadListener();
				}
			};
		},
		listen(listener) {
			registerPopstateListener();
			registerBeforeUnloadListener();

			listeners.push(listener);

			// Call listener when it is registered
			notifyListeners([listener]);

			return () => {
				listeners = listeners.filter(fn => fn !== listener);
				if (promptHandlers.length === 0 && listeners.length === 0) {
					removePopstateListener();
					removeBeforeUnloadListener();
				}
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
		navigate(to, options) {
			if (!promptIfNecessary()) {
				return;
			}

			const { state = {}, replace = false } = options || {};
			action = replace ? REPLACE : PUSH;
			if (isNumber(to)) {
				if (options) {
					warn(
						NAVIGATE_ID,
						"Navigation options (state or replace) are not supported, " +
							"when passing a number as the first argument to navigate. " +
							"They are ignored.",
					);
				}
				action = POP;
				source.history.go(to);
			} else {
				const keyedState = { ...state, _key: createGlobalId() };
				// try...catch iOS Safari limits to 100 pushState calls
				try {
					source.history[replace ? "replaceState" : "pushState"](
						keyedState,
						"",
						to,
					);
				} catch (e) {
					source.location[replace ? "replace" : "assign"](to);
				}
			}

			location = getLocation(source);
			notifyListeners();
		},
	};
}

function createStackFrame(state, uri) {
	return { ...createLocation(uri), state };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
	let index = 0;
	let stack = [createStackFrame(null, initialPathname)];

	return {
		// This is just for testing...
		get entries() {
			return stack;
		},
		get location() {
			return stack[index];
		},
		addEventListener() {},
		removeEventListener() {},
		history: {
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
				const newIndex = index + to;
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
const canUseDOM = !!(
	!isSSR &&
	window.document &&
	window.document.createElement
);
// Use memory history in iframes (for example in Svelte REPL)
const isEmbeddedPage = !isSSR && window.location.origin === "null";
const globalHistory = createHistory(
	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
);
const { navigate } = globalHistory;

export { globalHistory, navigate, createHistory, createMemorySource };
