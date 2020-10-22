<script>
	import { getContext } from "svelte";
	import { LOCATION, ROUTER } from "../../../src/contexts";

	export let onChange = () => {};

	const location = getContext(LOCATION);
	const {
		activeRoute,
		base,
		registerRoute,
		unregisterRoute,
		history,
	} = getContext(ROUTER);

	$: onChange({
		location: $location,
		activeRoute: $activeRoute,
		base,
		registerRoute,
		unregisterRoute,
		history,
	});
</script>
