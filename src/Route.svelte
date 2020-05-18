<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { getContext, setContext, onDestroy, tick } from "svelte";
  import { ROUTER, ROUTE } from "./contexts";
  import { useActiveRoute, useLocation, useNavigate } from "./hooks";
  import { createLocalId, isSSR } from "./utils";
  import { focusElement, queryHeading } from "./dom";
  import { stripSplat, join } from "./paths";
  import { warn, ROUTE_ID } from "./warning";

  export let path = "";
  export let component = null;
  export let meta = {};

  const id = createLocalId();

  const { registerRoute, unregisterRoute } = getContext(ROUTER);
  const parentCtx = getContext(ROUTE);
  const parentBase = (parentCtx && parentCtx.base) || "";
  const activeRoute = useActiveRoute();
  const location = useLocation();
  const navigate = useNavigate();

  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === "",
    base: join(parentBase, stripSplat(path)),
    id,
    meta,
  };
  let params = {};
  let props = {};

  $: isActive = $activeRoute && $activeRoute.route.id === route.id;

  $: if (isActive) {
    params = $activeRoute.params;
  }

  $: {
    // eslint-disable-next-line no-shadow
    const { path: newPath, component, ...rest } = $$props;
    if (path && newPath && path !== newPath) {
      warn(ROUTE_ID, 'You cannot change a routes "path" prop. It is ignored.');
    }
    props = rest;
  }

  registerRoute(route);

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway.
  if (!isSSR) {
    onDestroy(() => {
      unregisterRoute(route);
    });
  }

  $: if (isActive) {
    tick().then(() => {
      const focusHeading = queryHeading(id);
      if (focusHeading) {
        focusElement(focusHeading);
      }
    });
  }

  setContext(ROUTE, route);
</script>

<div style="display:none;" aria-hidden="true" data-svnav-route-start={id} />
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
<div style="display:none;" aria-hidden="true" data-svnav-route-end={id} />
