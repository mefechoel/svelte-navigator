// eslint-disable-next-line import/no-extraneous-dependencies
import { createHashHistory } from "@svelte-navigator/history";

export const globalHistory = createHashHistory();

export const { navigate } = globalHistory;
