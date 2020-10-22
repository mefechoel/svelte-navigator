<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Blog from "./Blog.svelte";
	import UrlBar from "./UrlBar.svelte";
</script>

<Router>
	<UrlBar />

	<header>
		<h1>History</h1>

		<nav>
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
