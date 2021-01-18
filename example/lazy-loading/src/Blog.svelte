<script>
	import { Route, Link } from "svelte-navigator";

	export let blogRoute;
</script>

<div class="Blog">
	<h2>Blog</h2>

	<span>You're at blog/{blogRoute}</span>

	<nav>
		<Link to="../">Go back to the landing page</Link>
	</nav>

	<p>
		Read about interesting stuff here, like
		<Link to="svelte">Svelte</Link>
		or
		<Link to="navigator">Svelte Navigator</Link>
	</p>

	<article>
		<Route path=":id" let:params>
			<h2>ID: {params.id}</h2>
			<p>I don't know what to do with this...</p>
		</Route>

		<Route path="svelte">
			<h2>Svelte</h2>
			<p>
				Svelte is a radical new approach to building user interfaces. Whereas
				traditional frameworks like React and Vue do the bulk of their work in
				the browser, Svelte shifts that work into a compile step that happens
				when you build your app. Instead of using techniques like virtual DOM
				diffing, Svelte writes code that surgically updates the DOM when the
				state of your app changes.
				<a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity">
					Read the introductory post
				</a>
				to learn more.
			</p>
		</Route>

		<Route path="navigator">
			<h2>Navigator</h2>
			<p>Simple, declarative routing for single page apps built with Svelte.</p>
		</Route>
	</article>
</div>
