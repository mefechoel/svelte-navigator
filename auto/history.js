// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory, createMemoryHistory } from "@svelte-navigator/history";
import { isSSR } from "../src/utils";

const canUseDOM = !!(
	!isSSR &&
	window.document &&
	window.document.createElement
);
// Use memory history in iframes (for example in Svelte REPL)
const isEmbeddedPage = !isSSR && window.location.origin === "null";

export const globalHistory =
	canUseDOM && !isEmbeddedPage ? createBrowserHistory() : createMemoryHistory();

export const { navigate } = globalHistory;
