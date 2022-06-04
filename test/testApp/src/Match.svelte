<script>
	import { useMatch } from "../../../auto/index";

	const relMatch = useMatch(":to/*somewhere");
	const absMatch = useMatch("/blog/match/:to/*somewhere");

	$: {
		window.useMatch = {
			relMatch: $relMatch,
			absMatch: $absMatch,
		};
	}
</script>
