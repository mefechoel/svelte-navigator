import shimEnv from "../src/envShim";

shimEnv();

export * from "../src/subpackageReExports";
export { default as Router } from "./HashRouter.svelte";
export { globalHistory, navigate } from "./history";
export { link, links } from "./actions";
