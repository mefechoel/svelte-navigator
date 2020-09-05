import { LocalComponent } from "./SvelteInternal";
import AnyObject from "./AnyObject";

export interface RouteProps<Meta extends AnyObject = AnyObject> {
  /**
   * The path for when this component should be rendered. If no `path` is
   * given the `Route` will act as the default that matches if no other
   * `Route` in the `Router` matches.
   */
  path?: string;
  /**
   * The component constructor that will be used for rendering when the `Route`
   * matches. If `component` is not set, the children of `Route` will be
   * rendered instead.
   */
  component?: Function;
  /**
   * An arbitrary object you can pass the `Route`, to later access it (for
   * example in `a11y.createAnnouncement`).
   */
  meta?: Meta;
  /**
   * If set to false, the parent `Router` will not manage focus for this
   * `Route` or any child `Route`s.
   */
  primary?: boolean;
}

/**
 * A component that will render its `component` property or children when its
 * ancestor `Router` component decides it is the best match.
 *
 * All properties other than `path`, `component`, `meta` and `primary` given to
 * the `Route` will be passed to the rendered `component`.
 *
 * A `Route` path can match parameters with `"path/:parameterName"` and
 * wildcards with `"path/*"` or `"path/*wildcardName"`. All parameters and
 * wildcard values will be provided to the `component` as props.
 * They can also be accessed inside a `Route` slot via `let:params`.
 *
 * The `Route` `component` will also receive the current `location`, as well as
 * the `navigate` function, that is scoped to the current `Route` as props.
 * They can be accessed inside the `Route` slot, via `let:location` and
 * `let:navigate`.
 */
declare class Route extends LocalComponent<RouteProps> {}

export default Route;
