import type { SvelteComponent } from "svelte";

export declare class LocalComponent<
	// eslint-disable-next-line @typescript-eslint/ban-types
	// eslint-disable-next-line @typescript-eslint/ban-types
	Props extends Record<string, any> = {},
	// eslint-disable-next-line @typescript-eslint/ban-types
	// eslint-disable-next-line @typescript-eslint/ban-types
	Slots extends Record<string, any> = {},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends SvelteComponent<Props, any, Slots> {
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
