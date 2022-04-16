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
} from "@svelte-navigator/history";
export { default as GenericRouter } from "./GenericRouter.svelte";
export { default as Route } from "./Route.svelte";
export { default as Link } from "./Link.svelte";
export { createLink, createLinks } from "./actions";
export {
	useLocation,
	useResolve,
	useResolvable,
	useNavigate,
	useMatch,
	useParams,
	useFocus,
} from "./hooks";
