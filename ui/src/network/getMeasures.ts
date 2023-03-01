import { Querier } from "@squashql/squashql-js";
import _flatten from "lodash/flatten";
import { ROOT_URL, measureDescriptions } from "../config";

const querier = new Querier(ROOT_URL);

const getMeasures = async () => {
  try {
    const measures = await querier.expression(
      _flatten(
        measureDescriptions.map((measureDescription) => [
          ...measureDescription.measures,
          ...measureDescription.comparisonMeasures,
        ])
      )
    );
    return measures;
  } catch (error) {
    console.error(error);
  }
};

export default getMeasures;
