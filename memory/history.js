// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from "@svelte-navigator/history";

export const globalHistory = createMemoryHistory();

export const { navigate } = globalHistory;
