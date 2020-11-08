// eslint-disable-next-line import/no-extraneous-dependencies
import { browserHistory, memoryHistory } from "svelte-navigator-history";
import { isSSR } from "../src/utils";

const canUseDOM = !!(
	!isSSR &&
	window.document &&
	window.document.createElement
);
// Use memory history in iframes (for example in Svelte REPL)
const isEmbeddedPage = !isSSR && window.location.origin === "null";

export const globalHistory =
	canUseDOM && !isEmbeddedPage ? browserHistory : memoryHistory;

export const { navigate } = globalHistory;
