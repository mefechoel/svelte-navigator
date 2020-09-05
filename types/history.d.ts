import { NavigateFn, NavigatorHistory } from "./NavigatorHistory";
import HistorySource from "./HistorySource";

export declare const navigate: NavigateFn;

export declare function createHistory(source: HistorySource): NavigatorHistory;
export declare function createMemorySource(
  initialPathname?: string,
): HistorySource;
export declare const globalHistory: NavigatorHistory;
