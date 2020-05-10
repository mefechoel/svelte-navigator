<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { getContext, onDestroy } from "svelte";
  import { ROUTER } from "./contexts";
  import { useActiveRoute, useLocation, useNavigate } from "./hooks";
  import { createLocalId, isSSR } from "./utils";

  export let path = "";
  export let component = null;
  export let meta = {};

  const id = createLocalId();

  const { registerRoute, unregisterRoute } = getContext(ROUTER);
  const activeRoute = useActiveRoute();
  const location = useLocation();
  const navigate = useNavigate();

  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === "",
    id,
    meta,
  };
  let routeParams = {};
  let routeProps = {};

  $: isActive = $activeRoute && $activeRoute.route.id === route.id;

  $: if (isActive) {
    routeParams = $activeRoute.params;
  }

  $: {
    // eslint-disable-next-line no-shadow
    const { path, component, ...rest } = $$props;
    routeProps = rest;
  }

  registerRoute(route);

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway.
  if (!isSSR) {
    onDestroy(() => {
      unregisterRoute(route);
    });
  }
</script>

{#if isActive}
  {#if component !== null}
    <svelte:component
      this={component}
      location={$location}
      {navigate}
      {...routeParams}
      {...routeProps}
    />
  {:else}
    <slot params={routeParams} location={$location} {navigate} />
  {/if}
{/if}
