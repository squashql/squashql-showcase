import { Querier } from "@squashql/squashql-js";

import { ROOT_URL } from "../config";
import getMeasures from "./getMeasures";

export const fetchDiscoveryData = async () => {
  try {
    const querier = new Querier(ROOT_URL);
    const discoveryData = await querier.getMetadata();
    const measures = (await getMeasures()) || [];

    return {
      ...discoveryData,
      measures,
    };
  } catch (error) {
    console.error(error);
  }
};
