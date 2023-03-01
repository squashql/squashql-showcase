import { CATEGORY_COLUMN, SUBCATEGORY_COLUMN } from "./constants"

export type Filter = { id: string; alias: string }

export const filters: Filter[] = [
  { id: CATEGORY_COLUMN, alias: "Category" },
  { id: SUBCATEGORY_COLUMN, alias: "Sub-category" },
]
