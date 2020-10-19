<script>
  import { Link, Route } from "../../../src";
</script>

<div data-testid="blog">BLOG</div>

<Link to="first">first</Link>
<Link to="second">second</Link>
<Link to="id123">id123</Link>

<Route path="first">
  <div data-testid="blog-first">BLOG-FIRST</div>
</Route>
<Route path="second">
  <div data-testid="blog-second">BLOG-SECOND</div>
</Route>
<Route path=":id" let:params>
  <div data-testid="blog-params">{params.id}</div>
</Route>
