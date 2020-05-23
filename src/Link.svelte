<script>
  /*
   * Adapted from https://github.com/EmilTholin/svelte-routing
   *
   * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
   */

  import { createEventDispatcher } from "svelte";
  import { useLocation, useLinkResolve, useHistory } from "./hooks";
  import { shouldNavigate } from "./utils";
  import { startsWith } from "./paths";

  export let to;
  export let replace = false;
  export let state = {};
  export let getProps = null;

  const location = useLocation();
  const dispatch = createEventDispatcher();
  const resolveLink = useLinkResolve();
  const { navigate } = useHistory();

  $: href = resolveLink(to);
  $: isPartiallyCurrent = startsWith($location.pathname, href);
  $: isCurrent = href === $location.pathname;
  $: ariaCurrent = isCurrent ? "page" : undefined;
  $: props = (() => {
    // eslint-disable-next-line no-shadow
    let { to, replace, state, getProps: _getProps, ...restProps } = $$props;
    if (typeof getProps === "function") {
      const dynamicProps = getProps({
        location: $location,
        href,
        isPartiallyCurrent,
        isCurrent,
      });
      restProps = { ...restProps, ...dynamicProps };
    }
    return restProps;
  })();

  function onClick(event) {
    dispatch("click", event);

    if (shouldNavigate(event)) {
      event.preventDefault();
      // Don't push another entry to the history stack when the user
      // clicks on a Link to the page they are currently on.
      const shouldReplace = isCurrent || replace;
      navigate(href, { state, replace: shouldReplace });
    }
  }
</script>

<a {href} aria-current={ariaCurrent} on:click={onClick} {...props}>
  <slot />
</a>
