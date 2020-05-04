<script>
  import {
    Router,
    Route,
    Link,
    link,
    links,
    navigate,
    createHistory,
    createMemorySource,
  } from "../../../src";
  import LocationChange from "./LocationChange.svelte";
  import Blog from "./Blog.svelte";
  import MemoryBlog from "./MemoryBlog.svelte";

  const memoryHistoryA = createHistory(createMemorySource());
  const memoryHistoryB = createHistory(createMemorySource("/base"));

  function appChange(state) {
    window.appState = state;
  }

  function memoryBChange(state) {
    window.memoryBState = state;
  }

  function customNavigate(...args) {
    window.customNavigateCalled = true;
    navigate(...args);
  }
</script>

<Router name="hist">
  <LocationChange onChange={appChange} />
  <nav>
    <Link data-has-attr data-testid="link-props" to="/">PROPS</Link>
    <Link
      data-does-not-have-attr
      getProps={() => ({ 'data-testid': 'link-get-props', 'data-has-attr': true })}
      to="about"
    >
      GET PROPS
    </Link>
    <Link data-testid="link-about-rel" to="about">ABOUT REL</Link>
    <Link data-testid="link-about-abs" to="/about">ABOUT ABS</Link>
    <Link data-testid="link-app-home" to="/">APP HOME</Link>
    <Link data-testid="link-back-home" to="../">ALSO APP HOME</Link>
    <Link data-testid="link-nowhere" to="nowhere">NOWHERE</Link>
    <Link data-testid="link-state" to="/" state={{ value: 'test-state' }}>
      HOME STATE
    </Link>
    <Link
      data-testid="link-about-push-state"
      to="about"
      state={{ value: 'test-push-state' }}
    >
      ABOUT PUSH STATE
    </Link>
    <Link data-testid="link-about-replace" to="about" replace>
      ABOUT REPLACE
    </Link>
    <Link
      data-testid="link-about-replace-state"
      to="about"
      state={{ value: 'test-replace-state' }}
      replace
    >
      ABOUT REPLACE STATE
    </Link>
    <Link data-testid="link-blog" to="blog">BLOG</Link>

    <div use:links>
      <a href="/about">
        <span data-testid="action-links-about">ACTION LINKS ABOUT</span>
      </a>
      <a data-testid="action-links-about-replace" href="/about" replace>
        ACTION LINKS ABOUT REPLACE
      </a>
    </div>

    <div use:links={customNavigate}>
      <a data-testid="action-links-custom-navigate" href="/about">
        ACTION LINKS ABOUT CUSTOM NAVIGATE
      </a>
    </div>

    <a use:link href="/about">
      <span data-testid="action-link-about">ACTION LINK ABOUT</span>
    </a>
    <a use:link data-testid="action-link-about-replace" href="/about" replace>
      ACTION LINK ABOUT REPLACE
    </a>
    <a
      use:link={customNavigate}
      data-testid="action-link-custom-navigate"
      href="/about"
    >
      ACTION LINK ABOUT CUSTOM NAVIGATE
    </a>
  </nav>
  <br />
  <main>
    <Route>
      <div data-testid="route-default">DEFAULT</div>
    </Route>
    <Route path="/">
      <div data-testid="route-home">HOME</div>
    </Route>
    <Route path="about">
      <div data-testid="route-about">ABOUT</div>
    </Route>
    <Route path="blog/*">
      <Link data-testid="link-app-blog-svelte-rel" to="svelte">
        APP BLOG SVELTE REL
      </Link>
      <Link data-testid="link-app-blog-svelte-abs" to="/svelte">
        APP BLOG SVELTE ABS
      </Link>
      <Blog />
    </Route>
  </main>
</Router>

<br />
<br />

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

<br />
<br />

<Router history={memoryHistoryB} basepath="/base" name="memB">
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
