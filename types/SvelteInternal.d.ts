import type { SvelteComponentTyped } from "svelte";

export declare class LocalComponent<
	// eslint-disable-next-line @typescript-eslint/ban-types
	Props = {},
	// eslint-disable-next-line @typescript-eslint/ban-types
	Slots = {},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends SvelteComponentTyped<Props, any, Slots> {
	// eslint-disable-next-line camelcase
	$$prop_def: Props;

	// eslint-disable-next-line camelcase
	$$slot_def: Slots;
}

export type LocalAction<Param = undefined> = (
	node: HTMLElement,
	param?: Param,
) => {
	// eslint-disable-next-line no-shadow
	update?: (param?: Param) => void;
	destroy?: () => void;
};
