<script>
  import { createEventDispatcher } from "svelte";
  import { useLocation, useResolve } from "./contexts.js";
  import { navigate } from "./history.js";
  import { startsWith, shouldNavigate } from "./utils.js";

  export let to = "#";
  export let replace = false;
  export let state = {};
  export let getProps = () => ({});

  const location = useLocation();
  const dispatch = createEventDispatcher();

  let href;
  let isPartiallyCurrent;
  let isCurrent;
  let props;
  $: href = useResolve(to);
  $: isPartiallyCurrent = startsWith($location.pathname, href);
  $: isCurrent = href === $location.pathname;
  $: ariaCurrent = isCurrent ? "page" : undefined;
  $: props = getProps({
    location: $location,
    href,
    isPartiallyCurrent,
    isCurrent,
  });

  function onClick(event) {
    dispatch("click", event);

    if (shouldNavigate(event)) {
      event.preventDefault();
      // Don't push another entry to the history stack when the user
      // clicks on a Link to the page they are currently on.
      const shouldReplace = $location.pathname === href || replace;
      navigate(href, { state, replace: shouldReplace, autoResolve: false });
    }
  }
</script>

<a {href} aria-current={ariaCurrent} on:click={onClick} {...props}>
  <slot />
</a>
