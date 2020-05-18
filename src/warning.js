export const ROUTER_ID = 0;
export const LINK_ID = 1;
export const ROUTE_ID = 2;

const labels = {
  [ROUTER_ID]: "<Router>",
  [LINK_ID]: "<Link>",
  [ROUTE_ID]: "<Route>",
};

const createMessage = (labelId, message) => `${labels[labelId]} ${message}`;

export const fail = (labelId, message) => {
  throw new Error(createMessage(labelId, message));
};

export const warn = (labelId, message) =>
  // eslint-disable-next-line no-console
  console.warn(createMessage(labelId, message));
