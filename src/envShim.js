const shimEnv = () => {
	try {
		throw process.env.NODE_ENV;
	} catch (e) {
		if (typeof e !== "string") {
			window.process = { env: { NODE_ENV: "development" } };

			if (process.env.NODE_ENV === "development") {
				// eslint-disable-next-line no-console
				console.warn(
					"SvelteNavigator: You did not correctly set the environment in your " +
						"build process. Falling back to unoptimized development mode. " +
						"Make sure to set the correct environment in your build process. " +
						"Visit https://github.com/mefechoel/svelte-navigator#setup-build-process " +
						"for more information.",
				);
			}
		}
	}
};

export default shimEnv;
