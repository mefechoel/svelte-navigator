<script>
	import { globalHistory } from "./history";
	import GenericRouter from "../src/GenericRouter.svelte";

	const UNDEF = undefined;
	export let basepath = UNDEF;
	export let url = UNDEF;
	export let primary = UNDEF;
	export let a11y = UNDEF;
</script>

<GenericRouter {a11y} {basepath} {url} {primary} history={globalHistory}>
	<slot />
</GenericRouter>
