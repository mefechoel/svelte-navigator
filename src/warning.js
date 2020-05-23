import { isFunction } from "./utils";

// We start from 1 here, so we can check if an origin id has been passed
// by using `originId || <fallback>`
export const ROUTER_ID = 1;
export const LINK_ID = 2;
export const ROUTE_ID = 3;

const labels = {
  [ROUTER_ID]: "Router",
  [LINK_ID]: "Link",
  [ROUTE_ID]: "Route",
};

export function createIdentificator(labelId, props) {
  let attr;
  if (labelId === ROUTE_ID) {
    attr = props.path ? `path="${props.path}"` : "default";
  } else if (labelId === LINK_ID) {
    attr = `to="${props.to}"`;
  }
  return `<${labels[labelId]} ${attr || ""} />`;
}

function createMessage(labelId, message, props, originId) {
  const origin = props && createIdentificator(originId || labelId, props);
  const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
  const label = labels[labelId];
  const msg = isFunction(message) ? message(label) : message;
  return `<${label}> ${msg}${originMsg}`;
}

const createMessageHandler = handler => (...args) =>
  handler(createMessage(...args));

export const fail = createMessageHandler(message => {
  throw new Error(message);
});

// eslint-disable-next-line no-console
export const warn = createMessageHandler(console.warn);
