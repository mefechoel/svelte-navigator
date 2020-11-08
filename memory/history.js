// eslint-disable-next-line import/no-extraneous-dependencies
import { memoryHistory } from "svelte-navigator-history";

export const globalHistory = memoryHistory;

export const { navigate } = globalHistory;
