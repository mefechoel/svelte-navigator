<script>
  import { useLocation, useMatch, useParams } from "../../../src";

  const location = useLocation();
  const relMatch = useMatch(":id/*splash");
  const absMatch = useMatch("/hooks/:id/*splash");
  const params = useParams();
</script>

<div data-testid="hooks-location-pathname">{$location.pathname}</div>
<div data-testid="hooks-location-search">{$location.search}</div>
<div data-testid="hooks-location-hash">{$location.hash}</div>
<div data-testid="hooks-match-rel-id">{$relMatch.params.id}</div>
<div data-testid="hooks-match-rel-splash">{$relMatch.params.splash}</div>
<div data-testid="hooks-match-abs-id">{$absMatch.params.id}</div>
<div data-testid="hooks-match-abs-splash">{$absMatch.params.splash}</div>
<div data-testid="hooks-params-id">{$params.id}</div>
<div data-testid="hooks-params-splash">{$params.splash}</div>
