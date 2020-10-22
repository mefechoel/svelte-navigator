<script>
	import { Router, Route, Link, link, links, navigate } from "../../../src";
	import LocationChange from "./LocationChange.svelte";
	import Blog from "./Blog.svelte";
	import Redirect from "./Redirect.svelte";

	function appChange(state) {
		window.appState = state;
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
			data-spread-attr
			data-duplicate-attr="rest"
			getProps={() => ({ 'data-testid': 'link-get-props', 'data-has-attr': true, 'data-duplicate-attr': 'getProps' })}
			to="about"
		>
			GET PROPS
		</Link>
		<Link data-testid="link-about-rel" to="about">ABOUT REL</Link>
		<Link data-testid="link-about-abs" to="/about">ABOUT ABS</Link>
		<Link data-testid="link-app-home" to="/">APP HOME</Link>
		<Link data-testid="link-back-home" to="../">ALSO APP HOME</Link>
		<Link data-testid="link-dashboard-mark" to="dashboard/mark">
			Marks Dashboard
		</Link>
		<Link data-testid="link-dashboard-paul" to="dashboard/paul">
			Pauls Dashboard
		</Link>
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
		<Link data-testid="link-blog-match-empty" to="blog/match">MATCH EMPTY</Link>
		<Link data-testid="link-blog-match-to" to="blog/match/some-path">
			MATCH SOME PATH
		</Link>
		<Link
			data-testid="link-blog-match-to-splat"
			to="blog/match/some-path/some-splat"
		>
			MATCH SOME PATH AND SPLAT
		</Link>

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

		<div use:links>
			<button data-testid="action-links-not-a-link">
				ACTION LINKS NOT A LINK
			</button>
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
		<Route path="dashboard/:username/*" let:params>
			<Link data-testid="link-dashboard-article-987" to="articles/987">
				Article 987
			</Link>
			<Route path="/">Hello {params.username}!</Route>
			<Route path="articles/:articleId" let:params>
				Article
				{params.articleId}
			</Route>
		</Route>

		<Route path="redirect-source">
			<Redirect to="/redirect-target" replace />
		</Route>
		<Route path="redirect-target">
			<div data-testid="redirect-target">REDIRECT-TARGET</div>
		</Route>
	</main>
</Router>
