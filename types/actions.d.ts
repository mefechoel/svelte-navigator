import { NavigatorHistory } from "@svelte-navigator/history";
import { LocalAction } from "./SvelteInternal";

export declare function createLink<State = unknown>(
	history: NavigatorHistory<State>,
): LocalAction<{ history: NavigatorHistory }>;

export declare function createLinks<State = unknown>(
	history: NavigatorHistory<State>,
): LocalAction<{ history: NavigatorHistory }>;
