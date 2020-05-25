<script>
  import { useFocus } from "../../../src";

  const registerFocus = useFocus();

  const timeout = new Promise(res => setTimeout(res, 300));
</script>

<h2 data-testid="a11y-route-e">Path D</h2>
{#await timeout then _}
  <p data-testid="a11y-route-e-focus" use:registerFocus>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum, quas?
  </p>
{/await}
