<script>
  import { Router, Route, Link, createHistory } from "svelte-navigator";
  import Blog from "./Blog.svelte";
  import BackButton from "./BackButton.svelte";
  import ForwardButton from "./ForwardButton.svelte";
  import createHashSource from "./hashHistory";

  const hash = createHistory(createHashSource());
</script>

<Router history={hash}>
  <header>
    <h1>History</h1>

    <nav>
      <BackButton />
      <ForwardButton />
      <Link to="/">Base</Link>
      <Link to="home">Home</Link>
      <Link to="about">About</Link>
      <Link to="blog">Blog</Link>
    </nav>
  </header>

  <main>
    <Route path="blog/*blogRoute" component={Blog} />

    <Route path="home">
      <h3>Home</h3>
      <p>Home sweet home...</p>
    </Route>

    <Route path="about">
      <h3>About</h3>
      <p>That's what it's all about!</p>
    </Route>

    <Route>
      <h3>Default</h3>
      <p>No Route could be matched.</p>
    </Route>
  </main>
</Router>
