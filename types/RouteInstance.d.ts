import RouteParams from "./RouteParam";
import AnyObject from "./AnyObject";

interface RouteInstance<
	Params extends RouteParams = RouteParams,
	Meta extends AnyObject = AnyObject
> {
	/**
	 * The path, the `Route` matched against.
	 */
	uri: string;
	/**
	 * The routes resolved path.
	 */
	path: string;
	/**
	 * The `meta` object associated with the `Route` component.
	 * It can be used to identify the `Route`, e.g. in a custom
	 * `a11y.createAnnouncement` function of a parent `Router`.
	 */
	meta: Meta;
	/**
	 * The params and wildcards matched by the `Route`s path.
	 * The path `/blog/:id/*`, matched against the uri `/blog/123/comments`
	 * will produce `{ id: "123", "*": "comments" }`.
	 */
	params: Params;
}

export default RouteInstance;
