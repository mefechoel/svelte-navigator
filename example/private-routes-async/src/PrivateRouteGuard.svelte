<script>
	import { onMount } from "svelte";
	import { useNavigate, useLocation, useFocus } from "svelte-navigator";
	import { user, asyncCheckAuthStatus } from "./stores";

	let isChecking = true;

	const navigate = useNavigate();
	const location = useLocation();
	const registerFocus = useFocus();

	const navigateToLogin = () => {
		navigate("/login", {
			state: { from: $location.pathname },
			replace: true,
		});
	};

	onMount(async () => {
		try {
			await asyncCheckAuthStatus();
		} catch {
			navigateToLogin();
		} finally {
			isChecking = false;
		}
	});

	$: if (!$user && !isChecking) {
		navigateToLogin();
	}
</script>

{#if $user && !isChecking}
	<slot {registerFocus} />
{/if}

{#if isChecking}
	<p>Checking auth status...</p>
{/if}
