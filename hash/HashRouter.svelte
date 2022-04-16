<script>
	import { globalHistory } from "./history";
	import GenericRouter from "../src/GenericRouter.svelte";
	import checkRouterHistoryType from "../src/checkRouterHistoryType";
	import { HASH_ROUTER_ID } from "../src/warning";

	const UNDEF = undefined;
	export let basepath = UNDEF;
	export let url = UNDEF;
	export let primary = UNDEF;
	export let a11y = UNDEF;
	export let history = globalHistory;

	checkRouterHistoryType(HASH_ROUTER_ID, history, "hash", "Hash");
</script>

<GenericRouter {a11y} {basepath} {url} {primary} {history}>
	<slot />
</GenericRouter>
