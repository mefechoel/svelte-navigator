/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

export { default as Router } from "./Router.svelte";
export { default as Route } from "./Route.svelte";
export { default as Link } from "./Link.svelte";
export { navigate, createHistory, createMemorySource } from "./history";
export { link, links } from "./actions";
export {
  useActiveRoute,
  useLocation,
  useBase,
  useLinkResolve,
  useNavigate,
  useMatch,
} from "./hooks";
