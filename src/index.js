/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

export {
	createBrowserHistory,
	createHashHistory,
	createMemoryHistory,
	browserHistory,
	hashHistory,
	memoryHistory,
	parsePath,
	stringifyPath,
} from "svelte-navigator-history";
export { default as Router } from "./Router.svelte";
export { default as BrowserRouter } from "./BrowserRouter.svelte";
export { default as HashRouter } from "./HashRouter.svelte";
export { default as MemoryRouter } from "./MemoryRouter.svelte";
export { default as AutoRouter } from "./AutoRouter.svelte";
export { default as Route } from "./Route.svelte";
export { default as Link } from "./Link.svelte";
export {
	navigate,
	createHistory,
	createMemorySource,
	globalHistory,
} from "./history";
export { link, links } from "./actions";
export {
	useLocation,
	useResolve,
	useResolvable,
	useNavigate,
	useMatch,
	useParams,
	useFocus,
} from "./hooks";
