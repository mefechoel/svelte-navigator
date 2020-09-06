export declare class LocalComponent<Props = {}, Slots = {}> {
  $$prop_def: Props;
  $$slot_def: Slots;
}

export type LocalAction<Param = undefined> = (
  node: HTMLElement,
  param?: Param,
) => {
  update?: (param?: Param) => void;
  destroy?: () => void;
};
