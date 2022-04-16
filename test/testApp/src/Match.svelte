<script>
	import { useMatch } from "../../../auto";

	const relMatch = useMatch(":to/*somewhere");
	const absMatch = useMatch("/blog/match/:to/*somewhere");

	$: {
		window.useMatch = {
			relMatch: $relMatch,
			absMatch: $absMatch,
		};
	}
</script>
