import { Readable } from "svelte/store";
import NavigatorLocation from "./NavigatorLocation";
import { LocalAction } from "./SvelteInternal";
import RouteParams from "./RouteParam";
import AnyObject from "./AnyObject";
import { NavigateFn } from "./history";

/**
 * Access the current location via a readable store.
 */
export declare function useLocation<
	State extends AnyObject = AnyObject
>(): Readable<NavigatorLocation<State>>;

/**
 * Resolve a given link relative to the current `Route` and the `Router`s
 * `basepath`. It is used under the hood in `Link` and `useNavigate`.
 * You can use it to manually resolve links, when using the `link` or `links`
 * actions.
 */
export declare function useResolve(): (path: string) => string;

/**
 * Manually resolve links, when using the `link` or `links` actions.
 * Like `useResolve`, but it returns a readable store, that updates
 * when the location changes.
 */
export declare function useResolvable(path: string): Readable<string>;

/**
 * A hook, that returns a context-aware version of `navigate`.
 * It will automatically resolve the given link relative to the current Route.
 * It will also resolve a link against the `basepath` of the Router.
 */
export declare function useNavigate(): NavigateFn;

interface RouteMatch<Params extends RouteParams> {
	path: string;
	fullPath: string;
	uri: string;
	params: Params;
}

/**
 * Use Svelte Navigators matching without needing to use a Route.
 * Returns a readable store with the potential match,
 * that changes, when the location changes.
 *
 * The provided path will be resolved relatively,
 * as you're used to with all paths in Svelte Navigator.
 */
export declare function useMatch<Params extends RouteParams>(
	path: string,
): Readable<RouteMatch<Params> | null>;

/**
 * Access the parent Routes matched params and wildcards.
 */
export declare function useParams<
	Params extends RouteParams
>(): Readable<Params>;

/**
 * Provide a custom element to focus, when the parent route is visited.
 * It returns the `registerFocus` function you can call manually with an
 * Element or use as a Svelte action via the `use` directive.
 */
export declare function useFocus(): LocalAction;
