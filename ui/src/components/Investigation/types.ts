type NullableField<T> = T | null;

export type ExpandColumn = {
  column: string;
  fields: NullableField<string>[] | NullableField<number>[];
  position: number;
  store: string;
};
