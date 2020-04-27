<script>
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
</script>

<button title="Go forward" on:click={() => navigate(1)}>-&gt;</button>
