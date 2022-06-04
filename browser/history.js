// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from "@svelte-navigator/history";

export const globalHistory = createBrowserHistory();

export const { navigate } = globalHistory;
