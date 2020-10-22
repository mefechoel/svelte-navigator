import RawLocation from "./RawLocation";
import { NavigateFn } from "./history";

/**
 * Possible action types.
 *
 * A pop action is the default action.
 * It is dispatched, when the back or forward buttons of the browser
 * are clicked or when the history stack is navigated via a call
 * to `NavigatorHistory.navigate`, with a number as an argument.
 *
 * A push action is dispatched, when clicking a `Link` or calling the
 * `navigate` function (e.g. from a call to `useNavigate`).
 * A new entry, that may contain a state, is pushed to the history stack.
 *
 * A replace action is dispatched, when clicking a `Link` with a `replace`
 * prop or calling the `navigate` function with `replace: true`.
 * The current entry in the history stack is replaced.
 */
export type NavigationAction = "POP" | "PUSH" | "REPLACE";

/**
 * Unsubscribe a listener function.
 * It won't be called on any future updates
 */
type Unlisten = () => void;

export interface NavigatorHistory {
	/**
	 * The current location
	 */
	readonly location: RawLocation;
	/**
	 * Listen to changes in location.
	 *
	 * @param listener The listener function will be called when the
	 * location changes.
	 * @returns The unlisten function, which can be used to unsubscribe
	 * the listener
	 */
	listen(
		listener: ({
			location,
			action,
		}: {
			location: RawLocation;
			action: NavigationAction;
		}) => void,
	): Unlisten;
	/**
	 * Navigate to a new route.
	 * @param to The path to navigate to.
	 *
	 * If `to` is a number we will navigate to the stack entry index + `to`
	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
	 * @param options Navigation options
	 */
	navigate: NavigateFn;
}
