<script>
  import { useMatch } from "../../../src";

  const relMatch = useMatch(":to/*somewhere");
  const absMatch = useMatch("/match/:to/*somewhere");

  $: {
    window.useMatch = {
      relMatch: $relMatch,
      absMatch: $absMatch,
    };
  }
</script>
