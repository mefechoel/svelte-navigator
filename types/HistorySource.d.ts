/* eslint-disable @typescript-eslint/ban-types */
interface HistorySource {
	readonly location: Location;
	addEventListener(event: "popstate", handler: () => void): void;
	removeEventListener(event: "popstate", handler: () => void): void;
	history: {
		readonly state: object;
		pushState(state: object, title: string, uri: string): void;
		replaceState(state: object, title: string, uri: string): void;
		go(to: number): void;
	};
}

export default HistorySource;
