<script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
</script>

<Route {path} let:params let:location let:navigate>
	<PrivateRouteGuard let:registerFocus>
		<slot {params} {location} {navigate} {registerFocus} />
	</PrivateRouteGuard>
</Route>
