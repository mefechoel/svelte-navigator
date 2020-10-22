// eslint-disable-next-line @typescript-eslint/ban-types
export declare class LocalComponent<Props = {}, Slots = {}> {
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
