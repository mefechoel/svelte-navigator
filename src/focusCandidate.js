// We need to move the focus queue to a separate file, so svelte does
// not update, when we mutate the queue.
// Also, we need a single global reference, because taking focus needs to
// work globally, even if we have multiple top level routers

// eslint-disable-next-line import/no-mutable-exports
export let focusCandidate = null;

// eslint-disable-next-line import/no-mutable-exports
export let initialNavigation = true;

export function pushFocusCandidate(item) {
  if (
    !focusCandidate ||
    item.level > focusCandidate.level ||
    (item.level === focusCandidate.level &&
      item.routerId < focusCandidate.routerId)
  ) {
    focusCandidate = item;
  }
}

export function clearFocusCandidate() {
  focusCandidate = null;
  initialNavigation = false;
}
