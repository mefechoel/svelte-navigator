<script>
  import { useLocation, useNavigate } from "svelte-navigator";

  const location = useLocation();
  const navigate = useNavigate();

  let url;

  $: {
    url = $location.pathname;
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate(url);
  }

  function handleInput(e) {
    url = e.target.value;
  }
</script>

<style>
  form {
    display: inline-block;
  }
</style>

<div>
  <button type="submit" on:click={() => navigate(-1)}>&lt;-</button>
  <button type="submit" on:click={() => navigate(1)}>-&gt;</button>
  <form on:submit={handleSubmit}>
    <input type="text" value={url} on:input={handleInput} />
    <button type="submit">GO</button>
  </form>
</div>
