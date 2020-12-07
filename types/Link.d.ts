import "svelte2tsx/svelte-jsx";
import { LocalComponent } from "./SvelteInternal";
import NavigatorLocation from "./NavigatorLocation";
import AnyObject from "./AnyObject";

declare namespace Link {
	interface GetPropsParams {
		location: NavigatorLocation;
		href: string;
		isPartiallyCurrent: boolean;
		isCurrent: boolean;
	}

	type GetProps<SpreadProps extends AnyObject = AnyObject> = ({
		location,
		href,
		isPartiallyCurrent,
		isCurrent,
	}: GetPropsParams) => SpreadProps;
}

interface LinkOnlyProps<State extends AnyObject = AnyObject> {
	/**
	 * URL the component should link to. It will be resolved relative
	 * to the current Route.
	 */
	to: string;
	/**
	 * When `true`, clicking the `Link` will replace the current entry in the
	 * history stack instead of adding a new one.
	 */
	replace?: boolean;
	/**
	 * An object that will be pushed to the history stack when the `Link` is
	 * clicked. A state is arbitrary data, that you don't want to communicate
	 * through the url, much like the body of a HTTP POST request.
	 */
	state?: State;
	/**
	 * A function that returns an object that will be spread on the underlying
	 * anchor element's attributes. The first argument given to the function is
	 * an object with the properties `location`, `href`, `isPartiallyCurrent`,
	 * `isCurrent`. Look at the `NavLink` component in the example project setup
	 * to see how you can build your own link components with this.
	 */
	getProps?: Link.GetProps;
	/**
	 * The class that will be passed to the underlying `<a>` tag.
	 */
	class?: string;
}

export type LinkProps<State extends AnyObject = AnyObject> = Omit<
	LinkOnlyProps<State> &
		svelte.JSX.HTMLProps<HTMLAnchorElement> &
		svelte.JSX.SapperAnchorProps,
	"href"
>;

/**
 * A component used to navigate around the application. It will automatically
 * resolve the `to` path relative to the current `Route` and to the `Router`s
 * `basepath`.
 */
declare class Link extends LocalComponent<LinkProps> {}

export default Link;
