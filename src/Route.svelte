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

  import { getContext, onDestroy, setContext } from "svelte";
  import { writable } from "svelte/store";
  import Router from "./Router.svelte";
  import { ROUTER, ROUTE, ROUTE_PARAMS, FOCUS_ELEM } from "./contexts";
  import {
    useLocation,
    useNavigate,
    useRouteBase,
    usePreflightCheck,
  } from "./hooks";
  import { isSSR } from "./utils";
  import { extractBaseUri } from "./routes";
  import { join } from "./paths";
  import { ROUTE_ID } from "./warning";

  export let path = "";
  export let component = null;
  export let meta = {};
  export let primary = true;

  usePreflightCheck(ROUTE_ID, $$props);

  const id = createId();

  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
  const parentBase = useRouteBase();
  const location = useLocation();
  const focusElement = writable(null);

  const route = writable();
  $: {
    // The route store will be re-computed whenever props, location or parentBase change.
    const isDefault = path === "";
    const rawBase = join($parentBase, path);
    const updatedRoute = {
      id,
      path,
      meta,
      // If no path prop is given, this Route will act as the default Route
      // that is rendered if no other Route in the Router is a match
      default: isDefault,
      fullPath: isDefault ? "" : rawBase,
      base: isDefault
        ? $parentBase
        : extractBaseUri(rawBase, $location.pathname),
      primary,
      focusElement,
    };
    route.set(updatedRoute);
    registerRoute(updatedRoute);
  }

  $: isActive = $activeRoute && $activeRoute.id === id;

  const params = writable({});
  $: if (isActive) {
    params.set($activeRoute.params);
  }

  setContext(ROUTE, route);
  setContext(ROUTE_PARAMS, params);
  setContext(FOCUS_ELEM, focusElement);

  // We need to call useNavigate after the route is set,
  // so we can use the routes path for link resolution
  const navigate = useNavigate();

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway
  if (!isSSR) {
    onDestroy(() => unregisterRoute(id));
  }
</script>

<div style="display:none;" aria-hidden="true" data-svnav-route-start={id} />
{#if isActive}
  <Router {primary}>
    {#if component !== null}
      <svelte:component
        this={component}
        location={$location}
        {navigate}
        {...$params}
        {...$$restProps}
      />
    {:else}
      <slot params={$params} location={$location} {navigate} />
    {/if}
  </Router>
{/if}
<div style="display:none;" aria-hidden="true" data-svnav-route-end={id} />
