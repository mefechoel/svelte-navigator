export declare class LocalComponent<Props = {}> {
  $$prop_def: Props;
}

export type LocalAction<Param = undefined> = (
  node: HTMLElement,
  param?: Param,
) => {
  update?: (param?: Param) => void;
  destroy?: () => void;
};
