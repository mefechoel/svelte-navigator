<script>
  import Router from "../../../src/Router.svelte";
  import Route from "../../../src/Route.svelte";
  import Link from "../../../src/Link.svelte";
</script>

<Router name="memBlog">
  <nav>
    <Link data-testid="link-memory-blog-svelte-rel" to="svelte">
      SVELTE REL
    </Link>
    <Link data-testid="link-memory-blog-home" to="/">BLOG HOME</Link>
    <Link data-testid="link-memory-blog-app-past-home" to="../../">
      APP HOME
    </Link>
  </nav>
  <article>
    <Route path="/">
      <div data-testid="route-memory-blog-home">BLOG HOME</div>
    </Route>
    <Route path="svelte">
      <div data-testid="route-memory-blog-svelte">SVELTE</div>
    </Route>
  </article>
</Router>
