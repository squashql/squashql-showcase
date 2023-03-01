import { from, Querier } from "@squashql/squashql-js";
import { SCENARIO_COLUMN, SCENARII_TABLE, ROOT_URL } from "../config";

export const fetchScenarii = async () => {
  try {
    const querier = new Querier(ROOT_URL);
    const query = from(SCENARII_TABLE)
      .select([SCENARIO_COLUMN], [], [])
      .build();
    const data = await querier.execute(query);

    const scenarii = data.table.rows.map((row) => row[0] as string);

    return scenarii;
  } catch (error) {
    console.error(error);
  }
};
