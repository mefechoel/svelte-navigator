/*
 * Adapted from https://github.com/EmilTholin/svelte-routing
 *
 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
 */

import { navigate as defaultNavigate } from "./history";
import { shouldNavigate, hostMatches } from "./utils";

/**
 * A link action that can be added to <a href=""> tags rather
 * than using the <Link> component.
 *
 * Example:
 * ```html
 * <a href="/post/{postId}" use:link>{post.title}</a>
 * ```
 */
function link(node, navigate = defaultNavigate) {
  function onClick(event) {
    const anchor = event.currentTarget;

    if (anchor.target === "" && hostMatches(anchor) && shouldNavigate(event)) {
      event.preventDefault();
      navigate(anchor.pathname + anchor.search, {
        replace: anchor.hasAttribute("replace"),
      });
    }
  }

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}

/**
 * An action to be added at a root element of your application to
 * capture all relative links and push them onto the history stack.
 *
 * Example:
 * ```html
 * <div use:links>
 *   <Router>
 *     <Route path="/" component={Home} />
 *     <Route path="/p/:projectId/:docId?" component={ProjectScreen} />
 *     {#each projects as project}
 *       <a href="/p/{project.id}">{project.title}</a>
 *     {/each}
 *   </Router>
 * </div>
 * ```
 */
function links(node, navigate = defaultNavigate) {
  function findClosest(tagName, el) {
    while (el && el.tagName !== tagName) {
      // eslint-disable-next-line no-param-reassign
      el = el.parentNode;
    }
    return el;
  }

  function onClick(event) {
    const anchor = findClosest("A", event.target);

    if (
      anchor &&
      anchor.target === "" &&
      hostMatches(anchor) &&
      shouldNavigate(event) &&
      !anchor.hasAttribute("noroute")
    ) {
      event.preventDefault();
      navigate(anchor.pathname + anchor.search, {
        replace: anchor.hasAttribute("replace"),
      });
    }
  }

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}

export { link, links };
