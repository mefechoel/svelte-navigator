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
  import { ROUTER, ROUTE } from "./contexts";
  import {
    useActiveRoute,
    useLocation,
    useNavigate,
    useRouteBase,
  } from "./hooks";
  import { isSSR } from "./utils";
  import { stripSplat, join } from "./paths";

  export let path = "";
  export let component = null;
  export let meta = {};

  const id = createId();

  const { registerRoute, unregisterRoute } = getContext(ROUTER);
  const parentBase = useRouteBase();
  const activeRoute = useActiveRoute();
  const location = useLocation();

  // eslint-disable-next-line no-shadow
  const createRoute = (path, meta, parentBase) => {
    const isDefault = path === "";
    const rawBase = join(parentBase, path);
    return {
      id,
      path,
      meta,
      // If no path prop is given, this Route will act as the default Route
      // that is rendered if no other Route in the Router is a match.
      default: path === "",
      fullPath: isDefault ? "" : rawBase,
      base: stripSplat(rawBase),
    };
  };

  const route = writable(createRoute(path, meta, $parentBase));

  $: {
    const updatedRoute = createRoute(path, meta, $parentBase);
    route.set(updatedRoute);
    registerRoute(updatedRoute);
  }

  let params = {};
  let props = {};

  $: isActive = $activeRoute && $activeRoute.route.id === id;

  $: if (isActive) {
    params = $activeRoute.params;
  }

  $: {
    // eslint-disable-next-line no-shadow
    const { path, component, meta, ...rest } = $$props;
    props = rest;
  }

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway.
  if (!isSSR) {
    onDestroy(() => {
      unregisterRoute(id);
    });
  }

  setContext(ROUTE, route);

  // We need to call useNavigate after the route is set,
  // so we can use the routes path for link resolution
  const navigate = useNavigate();
</script>

<div style="display:none;" aria-hidden="true" data-svnav-route-start={id} />
<Router>
  {#if isActive}
    {#if component !== null}
      <svelte:component
        this={component}
        location={$location}
        {navigate}
        {...params}
        {...props}
      />
    {:else}
      <slot {params} location={$location} {navigate} />
    {/if}
  {/if}
</Router>
<div style="display:none;" aria-hidden="true" data-svnav-route-end={id} />
