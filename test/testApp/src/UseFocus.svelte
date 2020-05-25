<script>
  import { useFocus } from "../../../src";

  const registerFocus = useFocus();
</script>

<h2 data-testid="a11y-route-d">Path D</h2>
<p data-testid="a11y-route-d-focus" use:registerFocus>
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum, quas?
</p>
