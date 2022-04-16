// eslint-disable-next-line import/no-extraneous-dependencies
import { browserHistory } from "@svelte-navigator/history";

export const globalHistory = browserHistory;

export const { navigate } = globalHistory;
