<script>
	import { globalHistory } from "./history";
	import Router from "../src/Router.svelte";

	const UNDEF = undefined;
	export let basepath = UNDEF;
	export let url = UNDEF;
	export let primary = UNDEF;
	export let a11y = UNDEF;
</script>

<Router {a11y} {basepath} {url} {primary} history={globalHistory}>
	<slot />
</Router>
