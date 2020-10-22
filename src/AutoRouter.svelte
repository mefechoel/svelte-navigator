<script>
	import { browserHistory, memoryHistory } from "svelte-navigator-history";
	import Router from "./Router.svelte";
	import { isSSR } from "./utils";

	const UNDEF = undefined;
	export let basepath = UNDEF;
	export let url = UNDEF;
	export let primary = UNDEF;
	export let a11y = UNDEF;

	const canUseDOM = !!(
		!isSSR &&
		window.document &&
		window.document.createElement
	);
	// Use memory history in iframes (for example in Svelte REPL)
	const isEmbeddedPage = !isSSR && window.location.origin === "null";
	const history = canUseDOM && !isEmbeddedPage ? browserHistory : memoryHistory;
</script>

<Router {a11y} {basepath} {url} {primary} {history}>
	<slot />
</Router>
