import { LocalComponent } from "./SvelteInternal";
import { NavigatorHistory } from "./NavigatorHistory";
import RouteInstance from "./RouteInstance";
import NavigatorLocation from "./NavigatorLocation";
import RouteParams from "./RouteParam";
import UnknownObject from "./UnknownObject";

declare namespace GenericRouter {
	namespace A11yConfig {
		type CreateAnnouncementFn<
			Params extends RouteParams = RouteParams,
			Meta extends UnknownObject = UnknownObject,
			State extends UnknownObject = UnknownObject
		> = (
			route: RouteInstance<Params, Meta>,
			location: NavigatorLocation<State>,
		) => string | Promise<string>;
	}

	interface A11yConfig<
		Params extends RouteParams = RouteParams,
		Meta extends UnknownObject = UnknownObject,
		State extends UnknownObject = UnknownObject
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

export interface GenericRouterProps<
	Params extends RouteParams = RouteParams,
	Meta extends UnknownObject = UnknownObject,
	State extends UnknownObject = UnknownObject
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
	 * falsy value will be ignored by the `GenericRouter`, so it's enough to declare
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
	 * If set to false, the `GenericRouter` will not manage focus for its children.
	 * Analougus to the `Route`s `primary` prop.
	 */
	primary?: boolean;
	/**
	 * Configuration object for Svelte Navigators accessibility features.
	 */
	a11y?: GenericRouter.A11yConfig<Params, Meta, State>;
}

/**
 * The `GenericRouter` component supplies the `Link` and `Route` descendant components
 * with routing information through context, so you need at least one `GenericRouter`
 * at the top of your application. It assigns a score to all its `Route`
 * descendants and picks the best match to render.
 */
declare class GenericRouter extends LocalComponent<GenericRouterProps> {}

export default GenericRouter;
