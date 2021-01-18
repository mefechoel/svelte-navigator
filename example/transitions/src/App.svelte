<script>
	import { Router, Route, Link } from "svelte-navigator";
	import GoodBoi from "./GoodBoi.svelte";
	import RouteTransition from "./RouteTransition.svelte";
	import TransitionContainer from "./TransitionContainer.svelte";
</script>

<Router>
	<div class="page-wrapper">
		<div class="page">
			<h1>Route Transitions</h1>
			<nav>
				<Link to="/">Home</Link>
				<Link to="about">About</Link>
				<Link to="something">Something</Link>
			</nav>
			<main>
				<TransitionContainer>
					<Route path="/">
						<RouteTransition x={200} duration={900}>
							<h2>Home</h2>
							<GoodBoi />
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
						</RouteTransition>
					</Route>
					<Route path="about">
						<RouteTransition x={200} duration={900}>
							<h2>About</h2>
							<GoodBoi />
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
						</RouteTransition>
					</Route>
					<Route path="something">
						<RouteTransition x={200} duration={900}>
							<h2>Something</h2>
							<GoodBoi />
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
								itaque illo harum, fugit fuga non repellat accusamus commodi
								deserunt deleniti dignissimos magni iste facilis! Voluptatibus
								adipisci provident ipsa aut repellat!
							</p>
						</RouteTransition>
					</Route>
				</TransitionContainer>
			</main>
		</div>
	</div>
</Router>

<style>
	:global(*) {
		font-family: sans-serif;
	}

	.page-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.page {
		width: 70vw;
	}
</style>
