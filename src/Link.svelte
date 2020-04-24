<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { createEventDispatcher } from "svelte";
  import { useLocation, useLinkResolve } from "./hooks";
  import { navigate } from "./history";
  import { startsWith, shouldNavigate } from "./utils";

  export let to;
  export let replace = false;
  export let state = {};
  export let getProps = null;

  const location = useLocation();
  const dispatch = createEventDispatcher();
  const resolveLink = useLinkResolve();

  $: href = resolveLink(to);
  $: isPartiallyCurrent = startsWith($location.pathname, href);
  $: isCurrent = href === $location.pathname;
  $: ariaCurrent = isCurrent ? "page" : undefined;
  $: props = (() => {
    if (typeof getProps === "function") {
      return getProps({
        location: $location,
        href,
        isPartiallyCurrent,
        isCurrent,
      });
    }
    // eslint-disable-next-line no-shadow
    const { to, replace, state, getProps: g, ...restProps } = $$props;
    return restProps;
  })();

  function onClick(event) {
    dispatch("click", event);

    if (shouldNavigate(event)) {
      event.preventDefault();
      // Don't push another entry to the history stack when the user
      // clicks on a Link to the page they are currently on.
      const shouldReplace = $location.pathname === href || replace;
      navigate(href, { state, replace: shouldReplace });
    }
  }
</script>

<a {href} aria-current={ariaCurrent} on:click={onClick} {...props}>
  <slot />
</a>
