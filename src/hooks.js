import { getContext } from "svelte";
import { derived, get } from "svelte/store";
import { LOCATION, ROUTER, ROUTE } from "./contexts";
import { resolveLink, match, normalizeLocation } from "./routes";

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
    //   href: "http://localhost:5000/blog?id=123#comments",
    //   origin: "http://localhost:5000",
    //   protocol: "http:",
    //   host: "localhost:5000",
    //   hostname: "localhost",
    //   port: "5000",
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
    route: {
      path: string;
      fullPath: string;
      name: string | null;
      id: number;
      default: boolean;
    };
    params: {};
    uri: string;
  }} RouteMatch
 */

/**
 * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
 */

/**
 * Access the Route currenty matched by the Router from anywhere inside the Router context.
 * You can for example access Route params from outside the rendered Route or
 * from a deeply nested component without prop-drilling.
 *
 * @returns {RouteMatchStore}
 *
 * @example
  ```html
  <script>
    import { useActiveRoute } from "svelte-navigator";

    const activeRoute = useActiveRoute();

    $: console.log($activeRoute);
    // {
    //   route: {
    //     path: "blog/:id/",
    //     fullPath: "[basepath/]blog/:id/",
    //     name: "route-name",
    //     id: 123,
    //     default: false
    //   },
    //   params: {
    //     id: "123"
    //   },
    //   uri: "/blog/123"
    // }
  </script>
  ```
 */
export function useActiveRoute() {
  const { activeRoute } = getContext(ROUTER);
  return { subscribe: activeRoute.subscribe };
}

export function useHistory() {
  const { history } = getContext(ROUTER);
  return history;
}

/**
 * Resolve a given link relative to the current `Route` and the `Router` `basepath`.
 * It is used under the hood in `Link` and `useNavigate`.
 * You can use it to manually resolve links, when using the `link` or `links` actions.
 *
 * @returns {(path: string) => string}
 *
 * @example
  ```html
  <script>
    import { link, useLinkResolve } from "svelte-navigator";

    const resolve = useLinkResolve();
    // `resolvedLink` will be resolved relative to its parent Route
    // and the Routers `basepath`
    const resolvedLink = resolve("relativePath");
  </script>

  <a href={resolvedLink} use:link>Relative link</a>
  ```
 */
export function useLinkResolve() {
  const routeStore = getContext(ROUTE);
  const routeBase = routeStore ? get(routeStore).base : "/";
  const { basepath: appBase, base: baseStore } = getContext(ROUTER);
  const base = get(baseStore);
  /**
   * Resolves the path relative to the current route and basepath.
   *
   * @param {string} path The path to navigate to
   * @returns {string} The resolved path
   */
  const resolve = path => resolveLink(path, base, routeBase, appBase);
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
  const resolve = useLinkResolve();
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
    const target = typeof to === "number" ? to : resolve(to);
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
  const resolve = useLinkResolve();
  const { basepath: appBase } = getContext(ROUTER);
  const resolvedPath = resolve(path);
  const { pathname: fullPath } = normalizeLocation(
    { pathname: resolvedPath },
    appBase,
  );
  return derived(location, loc => match({ fullPath }, loc.pathname));
}
