<script context="module">
  // eslint-disable-next-line import/order
  import { createCounter } from "./utils";

  const createId = createCounter();
</script>

<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { getContext, setContext, onMount, tick } from "svelte";
  import { writable } from "svelte/store";
  import { LOCATION, ROUTER } from "./contexts";
  import { globalHistory } from "./history";
  import { join, normalizePath } from "./paths";
  import { pick, match, normalizeLocation } from "./routes";
  import { isSSR, deriveRouteBase } from "./utils";
  import { warn, ROUTER_ID } from "./warning";
  import {
    focusCandidate,
    pushFocusCandidate,
    clearFocusCandidate,
    initialNavigation,
  } from "./focusCandidate";
  import { handleFocus } from "./dom";

  export let basepath = "/";
  export let url = null;
  export let history = globalHistory;
  export let primary = true;

  // Remember the initial `basepath`, so we can fire a warning
  // when the user changes it later
  const initialBasepath = basepath;
  const normalizedBasepath = normalizePath(basepath);

  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);
  // If the Router is a decendant of a Route, use its base
  const base = deriveRouteBase("/");

  const isTopLevelRouter = !locationContext;
  const routerId = createId();

  const manageFocus = primary && !(routerContext && !routerContext.manageFocus);

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

  function registerRoute(routeParams) {
    const route = {
      ...routeParams,
      // Preserve the routes `path` prop, so using `useActiveRoute().path`
      // will always work the same, regardless if there is a basepath or not
      fullPath: routeParams.default ? "" : join($base, routeParams.path),
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

  function unregisterRoute(routeId) {
    routes.update(prevRoutes =>
      prevRoutes.filter(routeItem => routeItem.id !== routeId),
    );
  }

  $: if (basepath !== initialBasepath) {
    warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
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
        if (!focusCandidate) return;
        if (!initialNavigation) {
          handleFocus(focusCandidate.route);
        }
        clearFocusCandidate();
      });
    }
  }

  // Queue matched Route, so top level Router can decide which Route to focus.
  // Non primary Routers should just be ignored
  $: if (manageFocus && $activeRoute) {
    pushFocusCandidate({ level, routerId, route: $activeRoute.route });
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
    registerRoute,
    unregisterRoute,
    manageFocus,
    history: isTopLevelRouter ? history : routerContext.history,
    basepath: isTopLevelRouter ? normalizedBasepath : routerContext.basepath,
    level,
  });
</script>

<slot />
