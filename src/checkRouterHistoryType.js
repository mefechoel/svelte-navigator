import { HistoryType } from "@svelte-navigator/history";
import { fail, failProd } from "./warning";

const checkRouterHistoryType = (labelId, history, historyType, historyName) => {
	const actualHistory = history[HistoryType];
	if (actualHistory !== historyType) {
		if (process.env.NODE_ENV !== "production") {
			if (actualHistory) {
				fail(
					labelId,
					`Incompatible history supplied to ${historyName}Router. Expected ` +
						`history of type "${historyType}", but found history of type ` +
						`"${actualHistory}". Use the appropriate router module:\n\n` +
						`import { Router } from "svelte-navigator/${actualHistory}"`,
				);
			} else {
				fail(
					labelId,
					`Incompatible history supplied to ${historyName}Router. Expected ` +
						`history of type "${historyType}", but found unknown history ` +
						"type. Use the appropriate router module from " +
						'"svelte-navigator/browser", "svelte-navigator/hash", ' +
						'"svelte-navigator/memory" ' +
						"or use the generic router if you want to use a custom history:\n\n" +
						'import { Router } from "svelte-navigator"\n' +
						"// ...\n" +
						"<Router history={myCustomHistory}> ... </Router>",
				);
			}
		} else {
			failProd(labelId);
		}
	}
};

export default checkRouterHistoryType;
