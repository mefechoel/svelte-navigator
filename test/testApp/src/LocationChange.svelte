<script>
  import { getContext } from "svelte";
  import { LOCATION, ROUTER } from "../../../src/contexts";

  export let onChange = () => {};

  const location = getContext(LOCATION);
  const {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute,
    history,
  } = getContext(ROUTER);

  $: onChange({
    location: $location,
    activeRoute: $activeRoute,
    base: $base,
    routerBase: $routerBase,
    registerRoute,
    unregisterRoute,
    history,
  });
</script>
