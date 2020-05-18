<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { getContext, setContext, onMount, tick } from "svelte";
  import { writable, derived } from "svelte/store";
  import { LOCATION, ROUTER } from "./contexts";
  import { globalHistory } from "./history";
  import {
    pick,
    match,
    join,
    normalizePath,
    normalizeLocation,
    isSSR,
  } from "./utils";
  import { warn, ROUTER_ID } from "./warning";
  import { focusQueue, clearFocusQueue } from "./focusQueue";

  export let basepath = "/";
  export let url = null;
  export let history = globalHistory;

  // Remember the initial `basepath`, so we can fire a warning
  // when the user changes it later
  const initialBasepath = basepath;
  const normalizedBasepath = normalizePath(basepath);

  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);

  const isTopLevelRouter = !locationContext;

  const routes = writable([]);
  const activeRoute = writable(null);
  // Used in SSR to synchronously set that a Route is active.
  let hasActiveRoute = false;

  // Nesting level of router.
  // We will need this to identify sibling routers, when moving
  // focus on navigation, so we can focus the first possible router
  const level = isTopLevelRouter ? 0 : routerContext.level + 1;

  // If we're running an SSR we force the location to the `url` prop
  const getInitialLocation = () =>
    normalizeLocation(
      isSSR ? { pathname: url } : history.location,
      normalizedBasepath,
    );
  const location = isTopLevelRouter
    ? writable(getInitialLocation())
    : locationContext;

  // If routerContext is set, the routerBase of the parent Router
  // will be the base for this Router's descendants
  const base = isTopLevelRouter
    ? writable({ path: "/", uri: "/" })
    : routerContext.routerBase;

  const routerBase = derived([base, activeRoute], ([_base, _activeRoute]) => {
    // If there is no activeRoute, the routerBase will be identical to the base
    if (!_activeRoute) {
      return _base;
    }

    const { route, uri } = _activeRoute;
    // Remove the potential /* or /*splatname from
    // the end of the child Routes path
    const path = route.default
      ? _base.path
      : route.fullPath.replace(/\*.*$/, "");
    return { path: normalizePath(path), uri };
  });

  function createFullPath(route, routerBasepath) {
    return route.default ? "" : join(routerBasepath, route.path);
  }

  function registerRoute(routeParams) {
    const route = {
      ...routeParams,
      // Preserve the routes `path` prop, so using `useActiveRoute().path`
      // will always work the same, regardless if there is a basepath or not
      fullPath: createFullPath(routeParams, $base.path),
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

  $: if (basepath !== initialBasepath) {
    warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
  }

  // This reactive statement will update all the Routes' fullPaths when
  // the basepath changes.
  $: {
    routes.update(prevRoutes =>
      prevRoutes.map(route => ({
        ...route,
        fullPath: createFullPath(route, $base.path),
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

    // Manage focus
    if (isTopLevelRouter) {
      tick().then(() => {
        clearFocusQueue();
      });
    }
  }

  // Queue matched route, so top level router can decide which route to focus
  $: if ($activeRoute) {
    focusQueue.push({ level, id: bestMatch.route.id });
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
    level,
  });
</script>

<slot />
