// eslint-disable-next-line import/no-extraneous-dependencies
import { hashHistory } from "svelte-navigator-history";

export const globalHistory = hashHistory;

export const { navigate } = globalHistory;
