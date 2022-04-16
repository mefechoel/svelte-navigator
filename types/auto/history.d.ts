import {
	BrowserHistory,
	MemoryHistory,
	NavigateFn,
} from "@svelte-navigator/history";

export declare const globalHistory: MemoryHistory | BrowserHistory;

export declare const navigate: NavigateFn;
