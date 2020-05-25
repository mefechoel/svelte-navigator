<script>
  import {
    Router,
    Route,
    Link,
    createHistory,
    createMemorySource,
  } from "../../../src";

  const memoryHistoryA = createHistory(createMemorySource());
</script>

<Router history={memoryHistoryA} name="memA">
  <nav>
    <Link data-testid="link-memory-a-home" to="/">MEMORY HOME</Link>
    <Link data-testid="link-memory-a-about" to="about">MEMORY ABOUT REL</Link>
    <Link data-testid="link-memory-a-nowhere" to="nowhere">MEMORY NOWHERE</Link>
  </nav>
  <br />
  <div>
    <Route>
      <div data-testid="route-memory-a-default">MEMORY DEFAULT</div>
    </Route>
    <Route path="/">
      <div data-testid="route-memory-a-home">MEMORY HOME</div>
    </Route>
    <Route path="about">
      <div data-testid="route-memory-a-about">MEMORY ABOUT</div>
    </Route>
  </div>
</Router>
