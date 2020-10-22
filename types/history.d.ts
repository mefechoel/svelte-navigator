import { NavigatorHistory } from "./NavigatorHistory";
import HistorySource from "./HistorySource";
import AnyObject from "./AnyObject";

export interface NavigateOptions<State extends AnyObject = AnyObject> {
	/**
	 * The state will be accessible through `location.state`
	 */
	state?: State;
	/**
	 * Replace the current entry in the history stack,
	 * instead of pushing on a new one
	 */
	replace?: boolean;
}

type NavigateFn<State extends AnyObject = AnyObject> = {
	/**
	 * Navigate to a new route.
	 * @param to The path to navigate to.
	 *
	 * If `to` is a number we will navigate to the stack entry index + `to`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 * @param options Navigation options
	 */
	(to: string, options?: NavigateOptions<State>): void;
	/**
	 * Navigate to a new route.
	 * @param delta Navigate to the stack entry index + `delta`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 */
	(delta: number): void;
};

export const navigate: NavigateFn;

export declare function createHistory(source: HistorySource): NavigatorHistory;
export declare function createMemorySource(
	initialPathname?: string,
): HistorySource;
export declare const globalHistory: NavigatorHistory;
