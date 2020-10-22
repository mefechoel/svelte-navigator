<script>
	import Main from "./Main.svelte";
	import MemoryA from "./MemoryA.svelte";
	import MemoryB from "./MemoryB.svelte";
	import A11y from "./A11y.svelte";
</script>

<style>
	:global(*:focus) {
		border: 2px dotted green;
	}
</style>

<Main />

<br />
<br />

<MemoryA />

<br />
<br />

<MemoryB />

<br />
<br />

<A11y />
