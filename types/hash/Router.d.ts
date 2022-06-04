import { LocalComponent } from "../SvelteInternal";
import RouteParams from "../RouteParam";
import UnknownObject from "../UnknownObject";
import GenericRouter from "../GenericRouter";

declare namespace HashRouter {
	namespace A11yConfig {
		type CreateAnnouncementFn<
			Params extends RouteParams = RouteParams,
			Meta extends UnknownObject = UnknownObject,
			State extends UnknownObject = UnknownObject
		> = GenericRouter.A11yConfig.CreateAnnouncementFn<Params, Meta, State>;
	}

	type A11yConfig<
		Params extends RouteParams = RouteParams,
		Meta extends UnknownObject = UnknownObject,
		State extends UnknownObject = UnknownObject
	> = GenericRouter.A11yConfig<Params, Meta, State>;
}

export interface HashRouterProps<
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
	a11y?: HashRouter.A11yConfig<Params, Meta, State>;
}

/**
 * The `Router` component supplies the `Link` and `Route` descendant components
 * with routing information through context, so you need at least one `Router`
 * at the top of your application. It assigns a score to all its `Route`
 * descendants and picks the best match to render.
 */
declare class HashRouter extends LocalComponent<HashRouterProps> {}

export default HashRouter;