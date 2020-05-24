import { getContext } from "svelte";
import { derived, get, writable } from "svelte/store";
import { LOCATION, ROUTER, ROUTE, ROUTE_PARAMS } from "./contexts";
import { resolveLink, match, normalizeLocation } from "./routes";
import { isNumber } from "./utils";
import { fail } from "./warning";

/**
 * Access the current location via a readable store.
 * @returns {import("svelte/store").Readable<{
    pathname: string;
    search: string;
    hash: string;
    state: {};
  }>}
 *
 * @example
  ```html
  <script>
    import { useLocation } from "svelte-navigator";

    const location = useLocation();

    $: console.log($location);
    // {
    //   pathname: "/blog",
    //   search: "?id=123",
    //   hash: "#comments",
    //   state: {}
    // }
  </script>
  ```
 */
export function useLocation() {
  const { subscribe } = getContext(LOCATION);
  return { subscribe };
}

/**
 * @typedef {{
    path: string;
    fullPath: string;
    uri: string;
    params: {};
  }} RouteMatch
 */

/**
 * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
 */

/**
 * Access the history of top level Router.
 */
export function useHistory() {
  const { history } = getContext(ROUTER);
  return history;
}

/**
 * Access the base of the parent Route.
 */
export function useRouteBase() {
  const route = getContext(ROUTE);
  return route ? derived(route, _route => _route.base) : writable("/");
}

/**
 * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
 * It is used under the hood in `Link` and `useNavigate`.
 * You can use it to manually resolve links, when using the `link` or `links` actions.
 *
 * @returns {(path: string) => string}
 *
 * @example
  ```html
  <script>
    import { link, useResolve } from "svelte-navigator";

    const resolve = useResolve();
    // `resolvedLink` will be resolved relative to its parent Route
    // and the Routers `basepath`
    const resolvedLink = resolve("relativePath");
  </script>

  <a href={resolvedLink} use:link>Relative link</a>
  ```
 */
export function useResolve() {
  const routeBase = useRouteBase();
  const { basepath: appBase } = getContext(ROUTER);
  /**
   * Resolves the path relative to the current route and basepath.
   *
   * @param {string} path The path to resolve
   * @returns {string} The resolved path
   */
  const resolve = path => resolveLink(path, get(routeBase), appBase);
  return resolve;
}

/**
 * A hook, that returns a context-aware version of `navigate`.
 * It will automatically resolve the given link relative to the current Route.
 * It will also resolve a link against the `basepath` of the Router.
 *
 * @example
  ```html
  <!-- App.svelte -->
  <script>
    import { link, Route } from "svelte-navigator";
    import RouteComponent from "./RouteComponent.svelte";
  </script>

  <Router>
    <Route path="route1">
      <RouteComponent />
    </Route>
    <!-- ... -->
  </Router>

  <!-- RouteComponent.svelte -->
  <script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
  </script>

  <button on:click="{() => navigate('relativePath')}">
    go to /route1/relativePath
  </button>
  <button on:click="{() => navigate('/absolutePath')}">
    go to /absolutePath
  </button>
  ```
  *
  * @example
  ```html
  <!-- App.svelte -->
  <script>
    import { link, Route } from "svelte-navigator";
    import RouteComponent from "./RouteComponent.svelte";
  </script>

  <Router basepath="/base">
    <Route path="route1">
      <RouteComponent />
    </Route>
    <!-- ... -->
  </Router>

  <!-- RouteComponent.svelte -->
  <script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
  </script>

  <button on:click="{() => navigate('relativePath')}">
    go to /base/route1/relativePath
  </button>
  <button on:click="{() => navigate('/absolutePath')}">
    go to /base/absolutePath
  </button>
  ```
 */
export function useNavigate() {
  const resolve = useResolve();
  const { navigate } = useHistory();
  /**
   * Navigate to a new route.
   * Resolves the link relative to the current route and basepath.
   *
   * @param {string|number} to The path to navigate to.
   *
   * If `to` is a number we will navigate to the stack entry index + `to`
   * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
   * @param {Object} options
   * @param {*} [options.state]
   * @param {boolean} [options.replace=false]
   */
  const navigateRelative = (to, { state, replace = false } = {}) => {
    // If to is a number, we navigate to the target stack entry via `history.go`.
    // Otherwise resolve the link
    const target = isNumber(to) ? to : resolve(to);
    return navigate(target, { state, replace });
  };
  return navigateRelative;
}

/**
 * Use Svelte Navigators matching without needing to use a Route.
 * Returns a readable store with the potential match,
 * that changes, when the location changes.
 *
 * The provided path will be resolved relatively,
 * as you're used to with all paths in Svelte Navigator
 *
 * @param {string} path The path, to match against.
 * It works just like a Route path
 * @returns {RouteMatchStore} The matched route.
 * Returns `null`, when nothing could be matched
 *
 * @example
  ```html
  <script>
    import { useMatch } from "svelte-navigator";

    const relativeMatch = useMatch("relative/path/:to/*somewhere");
    const absoluteMatch = useMatch("/absolute/path/:to/*somewhere");

    $: console.log($relativeMatch.params.to);
    $: console.log($absoluteMatch.params.somewhere);
  </script>
  ```
 */
export function useMatch(path) {
  const location = useLocation();
  const resolve = useResolve();
  const { basepath: appBase } = getContext(ROUTER);
  const resolvedPath = resolve(path);
  const { pathname: fullPath } = normalizeLocation(
    { pathname: resolvedPath },
    appBase,
  );
  return derived(location, loc => match({ fullPath, path }, loc.pathname));
}

/**
 * Access the parent Routes matched params and wildcards
 * @returns {import("svelte/store").Readable<{
     [param: string]: any;
   }>} A readable store containing the matched parameters and wildcards
 *
 * @example
  ```html
  <!--
    Somewhere inside <Route path="user/:id/*splat" />
    with a current url of "/myApp/user/123/pauls-profile"
  -->
  <script>
    import { useParams } from "svelte-navigator";

    const params = useParams();

    $: console.log($params); // -> { id: "123", splat: "pauls-profile" }
  </script>

  <h3>Welcome user {$params.id}! bleep bloop...</h3>
  ```
 */
export function useParams() {
  const { subscribe } = getContext(ROUTE_PARAMS);
  return { subscribe };
}

/**
 * Check if a Link or Route have been created outside of a Router
 * @param {number} componentId
 * @param {*} props
 */
export function usePreflightCheck(componentId, props) {
  const routerCtx = getContext(ROUTER);
  if (!routerCtx) {
    fail(
      componentId,
      label => `You cannot use a ${label} outside of a Router.`,
      props,
    );
  }
}
