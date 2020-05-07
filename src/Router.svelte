<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { getContext, setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { LOCATION, ROUTER } from "./contexts";
  import { globalHistory } from "./history";
  import { pick, match, join, normalizePath, normalizeLocation } from "./utils";

  export let basepath = "/";
  export let url = null;
  export let history = globalHistory;

  const normalizedBasepath = normalizePath(basepath);

  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);

  const isTopLevelRouter = !locationContext;
  const isSSR = typeof window === "undefined";

  const routes = writable([]);
  const activeRoute = writable(null);
  let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

  // If we're running an SSR we force the location to the `url` prop.
  const getInitialLocation = () =>
    normalizeLocation(
      isSSR ? { pathname: url } : history.location,
      normalizedBasepath,
    );
  // If locationContext is not set, this is the topmost Router in the tree.
  const location = isTopLevelRouter
    ? writable(getInitialLocation())
    : locationContext;

  // If routerContext is set, the routerBase of the parent Router
  // will be the base for this Router's descendants.
  // If routerContext is not set, the path and resolved uri will both
  // have the value of the basepath prop.
  const base = isTopLevelRouter
    ? writable({ path: "/", uri: "/" })
    : routerContext.routerBase;

  const routerBase = derived([base, activeRoute], ([_base, _activeRoute]) => {
    // If there is no activeRoute, the routerBase will be identical to the base.
    if (!_activeRoute) {
      return _base;
    }

    const { route, uri } = _activeRoute;
    // Remove the potential /* or /*splatname from
    // the end of the child Routes relative paths.
    const path = route.default
      ? _base.path
      : route.fullPath.replace(/\*.*$/, "");
    return { path: normalizePath(path), uri };
  });

  function registerRoute(routeParams) {
    const route = {
      ...routeParams,
      // Preserve the routes `path` prop, so using `useActiveRoute().path`
      // will always work the same, regardless if there is a basepath or not
      fullPath: routeParams.default ? "" : join($base.path, routeParams.path),
    };

    if (isSSR) {
      // In SSR we should set the activeRoute immediately if it is a match.
      // If there are more Routes being registered after a match is found,
      // we just skip them.
      if (hasActiveRoute) {
        return;
      }

      const matchingRoute = match(route, $location.pathname);
      if (matchingRoute) {
        activeRoute.set(matchingRoute);
        hasActiveRoute = true;
      }
    } else {
      routes.update(prevRoutes => [...prevRoutes, route]);
    }
  }

  function unregisterRoute(route) {
    routes.update(prevRoutes =>
      prevRoutes.filter(routeItem => routeItem.id !== route.id),
    );
  }

  // This reactive statement will update all the Routes' fullPaths when
  // the basepath changes.
  $: {
    routes.update(prevRoutes =>
      prevRoutes.map(route => ({
        ...route,
        fullPath: join($base.path, route.path),
      })),
    );
  }

  // This reactive statement will be run when the Router is created
  // when there are no Routes and then again the following tick, so it
  // will not find an active Route in SSR and in the browser it will only
  // pick an active Route after all Routes have been registered.
  $: {
    const bestMatch = pick($routes, $location.pathname);
    activeRoute.set(bestMatch);
  }

  if (isTopLevelRouter) {
    // The topmost Router in the tree is responsible for updating
    // the location store and supplying it through context.
    onMount(() => {
      const unlisten = history.listen(changedHistory => {
        const normalizedLocation = normalizeLocation(
          changedHistory.location,
          normalizedBasepath,
        );
        location.set(normalizedLocation);
      });

      return unlisten;
    });

    setContext(LOCATION, location);
  }

  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute,
    history: isTopLevelRouter ? history : routerContext.history,
    basepath: isTopLevelRouter ? normalizedBasepath : routerContext.basepath,
  });
</script>

<slot />
