<script>
	import { Router, Route, Link } from "../../../auto";
	import Home from "./Home.svelte";
	import About from "./About.svelte";
	import Blog from "./Blog.svelte";
	import Hooks from "./Hooks.svelte";

	// Used for SSR. A falsy value is ignored by the Router.
	export let url = "";
</script>

<Router {url}>
	<nav>
		<Link data-testid="link-home" to="/">Home</Link>
		<Link data-testid="link-about" to="about">About</Link>
		<Link data-testid="link-blog" to="blog">Blog</Link>
	</nav>
	<main>
		<Route path="about" component={About} />
		<Route path="blog/*" component={Blog} />
		<Route path="/" component={Home} />
		<Route path="hooks/:id/*splash" component={Hooks} />
	</main>
</Router>
