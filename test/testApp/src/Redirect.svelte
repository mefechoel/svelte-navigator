<script>
	import { useNavigate } from "../../../src";

	export let to;
	export let replace = false;

	const navigate = useNavigate();

	navigate(to, { replace });
</script>
