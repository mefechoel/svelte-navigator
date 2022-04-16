import { errorMessages } from "./errorCodes";

const invariant = (conditionFails, errorId, actual) => {
	if (conditionFails) {
		if (process.env.NODE_ENV !== "production") {
			let message = errorMessages[errorId];
			if (actual) {
				message += ` Got "${actual}"`;
			}
			throw new Error(message);
		}
		if (process.env.NODE_ENV === "production") {
			throw new Error(
				"<SvelteNavigator>: An error ocurred. Read more at " +
					`https://github.com/mefechoel/svelte-navigator/blob/main/ERROR_CODES.md#${errorId}`,
			);
		}
	}
};

export default invariant;
