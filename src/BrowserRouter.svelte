<script>
	import { browserHistory } from "svelte-navigator-history";
	import Router from "./Router.svelte";

	const UNDEF = undefined;
	export let basepath = UNDEF;
	export let url = UNDEF;
	export let primary = UNDEF;
	export let a11y = UNDEF;
	export let history = browserHistory;
</script>

<Router {a11y} {basepath} {url} {primary} {history}>
	<slot />
</Router>
