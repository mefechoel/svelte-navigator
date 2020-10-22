<script>
	/*
	 * Adapted from https://github.com/EmilTholin/svelte-routing
	 *
	 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
	 */

	import { createEventDispatcher } from "svelte";
	import {
		useLocation,
		useResolve,
		useHistory,
		usePreflightCheck,
	} from "./hooks";
	import { shouldNavigate, isFunction } from "./utils";
	import { startsWith } from "./paths";
	import { LINK_ID } from "./warning";

	export let to;
	export let replace = false;
	export let state = {};
	export let getProps = null;

	usePreflightCheck(LINK_ID, $$props);

	const location = useLocation();
	const dispatch = createEventDispatcher();
	const resolve = useResolve();
	const { navigate } = useHistory();

	// We need to pass location here to force re-resolution of the link,
	// when the pathname changes. Otherwise we could end up with stale path params,
	// when for example an :id changes in the parent Routes path
	$: href = resolve(to, $location);
	$: isPartiallyCurrent = startsWith($location.pathname, href);
	$: isCurrent = href === $location.pathname;
	$: ariaCurrent = isCurrent ? { "aria-current": "page" } : {};
	$: props = (() => {
		if (isFunction(getProps)) {
			const dynamicProps = getProps({
				location: $location,
				href,
				isPartiallyCurrent,
				isCurrent,
			});
			return { ...$$restProps, ...dynamicProps };
		}
		return $$restProps;
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

<a {href} {...ariaCurrent} on:click={onClick} {...props}>
	<slot />
</a>
