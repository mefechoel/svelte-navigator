import { LocalComponent } from "./SvelteInternal";
import { NavigatorHistory } from "./NavigatorHistory";
import RouteInstance from "./RouteInstance";
import NavigatorLocation from "./NavigatorLocation";
import RouteParams from "./RouteParam";
import AnyObject from "./AnyObject";

declare namespace Router {
	namespace A11yConfig {
		type CreateAnnouncementFn<
			Params extends RouteParams = RouteParams,
			Meta extends AnyObject = AnyObject,
			State extends AnyObject = AnyObject,
		> = (
			route: RouteInstance<Params, Meta>,
			location: NavigatorLocation<State>,
		) => string | Promise<string>;
	}

	interface A11yConfig<
		Params extends RouteParams = RouteParams,
		Meta extends AnyObject = AnyObject,
		State extends AnyObject = AnyObject,
	> {
		/**
		 * Function to create an announcement message, that is read by screen readers
		 * on navigation. It takes the matched `Route` and the current `location` as
		 * arguments and returns a `string` or a `Promise`, that resolves to a
		 * `string`.
		 *
		 * The default is `route => 'Navigated to ${route.uri}'`.
		 */
		createAnnouncement?: A11yConfig.CreateAnnouncementFn<Params, Meta, State>;
		/**
		 * Set it to false, to disable screen reader announcements.
		 */
		announcements?: boolean;
	}
}

export interface RouterProps<
	Params extends RouteParams = RouteParams,
	Meta extends AnyObject = AnyObject,
	State extends AnyObject = AnyObject,
> {
	/**
	 * The `basepath` property will be added to all `path` properties of `Route`
	 * descendants and to every navigation, that has access to the Routers
	 * context (from a `Link` with a `to` property or via `useNavigate`). This
	 * property can be ignored in most cases, but if you host your application on
	 * e.g. `https://example.com/my-site`, the `basepath` should be set to
	 * `/my-site`. Note that `navigate` and the `link` and `links` actions don't
	 * have access to the context. You may resolve the link manually using the
	 * `useResolve` hook.
	 */
	basepath?: string;
	/**
	 * The `url` property is used in SSR to force the current URL of the
	 * application and will be used by all `Link` and `Route` descendants. A
	 * falsy value will be ignored by the `Router`, so it's enough to declare
	 * `export let url = '';` for your topmost component and only give it a value
	 * in SSR.
	 */
	url?: string;
	/**
	 * The `history` property can be used to use a navigation method other than
	 * the browsers History API (See custom Hash based history).
	 */
	history?: NavigatorHistory;
	/**
	 * If set to false, the `Router` will not manage focus for its children.
	 * Analougus to the `Route`s `primary` prop.
	 */
	primary?: boolean;
	/**
	 * Configuration object for Svelte Navigators accessibility features.
	 */
	a11y?: Router.A11yConfig<Params, Meta, State>;
	/**
	 * Disable the inline styles, that are used internally by svelte-navigator.
	 * This might be necessary when your Content Security Policy disallows inline
	 * styles. To still remain functional, be sure to include the
	 * `svelte-navigator.css` in your application.
	 */
	disableInlineStyles?: boolean;
}

/**
 * The `Router` component supplies the `Link` and `Route` descendant components
 * with routing information through context, so you need at least one `Router`
 * at the top of your application. It assigns a score to all its `Route`
 * descendants and picks the best match to render.
 */
declare class Router extends LocalComponent<RouterProps> {}

export default Router;
