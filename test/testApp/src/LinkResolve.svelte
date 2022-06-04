<script>
	import { useResolve } from "../../../auto/index";

	const resolve = useResolve();

	window.resolveMap = {
		absHome: resolve("/"),
		absSomething: resolve("/something"),
		relSomething: resolve("something"),
		relBackSomething: resolve("../something"),
		relAppSomething: resolve("../../something"),
		relPastAppSomething: resolve("../../../something"),
		blogRoot: resolve(".."),
		appRoot: resolve("../.."),
		appPastRoot: resolve("../../.."),
	};
</script>
