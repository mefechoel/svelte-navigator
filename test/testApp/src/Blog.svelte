<script>
  import Router from "../../../src/Router.svelte";
  import Route from "../../../src/Route.svelte";
  import Link from "../../../src/Link.svelte";
  import LinkResolve from "./LinkResolve.svelte";
  import Navigate from "./Navigate.svelte";
  import BlogDefault from "./BlogDefault.svelte";
</script>

<Router>
  <nav>
    <Link data-testid="link-blog-svelte-rel" to="svelte">SVELTE REL</Link>
    <Link data-testid="link-blog-svelte-abs" to="/svelte">SVELTE ABS</Link>
    <Link data-testid="link-blog-home" to="/">BLOG HOME</Link>
    <Link data-testid="link-blog-app-home" to="../">APP HOME</Link>
    <Link data-testid="link-blog-id" to="article/123">ID: 123</Link>
    <Link data-testid="link-blog-splat" to="other/123">SPLAT</Link>
    <Link data-testid="link-blog-named-splat" to="whatever/123">
      NAMED SPLAT
    </Link>
    <Link data-testid="link-blog-resolve" to="resolve">RESOLVE</Link>
    <Link data-testid="link-blog-navigate" to="navigate">NAVIGATE</Link>
    <Link data-testid="link-blog-nowhere" to="nowhere">NOWHERE</Link>
  </nav>
  <article>
    <Route component={BlogDefault} />
    <Route path="/">
      <div data-testid="route-blog-home">BLOG HOME</div>
    </Route>
    <Route path="svelte">
      <div data-testid="route-blog-svelte">SVELTE</div>
    </Route>
    <Route path="resolve">
      <LinkResolve />
      <div data-testid="route-blog-resolve">RESOLVE</div>
    </Route>
    <Route path="navigate">
      <Navigate />
      <div data-testid="route-blog-navigate">NAVIGATE</div>
    </Route>
    <Route path="article/:id" let:params>
      <div data-testid="route-blog-id">ARTICLE_ID:{params.id}</div>
    </Route>
    <Route path="other/*" let:params>
      <div data-testid="route-blog-id">SPLAT:{params['*']}</div>
    </Route>
    <Route path="whatever/*splat" let:params>
      <div data-testid="route-blog-id">NAMED_SPLAT:{params.splat}</div>
    </Route>
  </article>
</Router>
