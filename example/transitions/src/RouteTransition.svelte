<script>
	import { fly } from "svelte/transition";

	export let x = 200;
	export let duration = 500;
	/** @type {"forward"|"backward"} */
	export let direction = "forward";

	let directionFactor;

	$: directionFactor = direction === "forward" ? 1 : -1;
</script>

<div
	class="route-wrapper"
	in:fly|global={{ x: x * directionFactor, duration }}
	out:fly|global={{ x: -x * directionFactor, duration }}
>
	<slot />
</div>

<style>
	.route-wrapper {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
