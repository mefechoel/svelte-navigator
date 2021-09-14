<script>
	import { onMount } from "svelte";
	import { useHistory } from "../../../src/hooks";

	const history = useHistory();

	let title = "";

	onMount(() =>
		history.prompt(() =>
			title !== "" ? "This is the prompt that should be shown" : undefined,
		),
	);
</script>

<input name="title" bind:value={title} />
