<script>
  import {
    Router,
    Route,
    Link,
    createHistory,
    createMemorySource,
  } from "../../../src";
  import LocationChange from "./LocationChange.svelte";
  import MemoryBlog from "./MemoryBlog.svelte";

  const memoryHistoryB = createHistory(createMemorySource("/base/path"));

  function memoryBChange(state) {
    window.memoryBState = state;
  }
</script>

<Router history={memoryHistoryB} basepath="/base/path" name="memB">
  <LocationChange onChange={memoryBChange} />
  <nav>
    <Link data-testid="link-memory-b-home" to="/">MEMORY HOME</Link>
    <Link data-testid="link-memory-b-home-replace" to="/" replace>
      MEMORY HOME REPLACE
    </Link>
    <Link data-testid="link-memory-b-about" to="about">MEMORY ABOUT REL</Link>
    <Link data-testid="link-memory-b-nowhere" to="nowhere">MEMORY NOWHERE</Link>
    <Link data-testid="link-memory-b-blog" to="blog">MEMORY BLOG</Link>
  </nav>
  <br />
  <div>
    <Route>
      <div data-testid="route-memory-b-default">MEMORY DEFAULT</div>
    </Route>
    <Route path="/">
      <div data-testid="route-memory-b-home">MEMORY HOME</div>
    </Route>
    <Route path="about">
      <div data-testid="route-memory-b-about">MEMORY ABOUT</div>
    </Route>
    <Route path="blog/*" component={MemoryBlog} />
  </div>
</Router>
