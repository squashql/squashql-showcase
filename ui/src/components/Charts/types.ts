interface ScenarioData {
  groupId: string;
  scenario: string;
  id: string;
  measure: string;
  result: number;
}

export interface ChartData {
  [measureName: string]: { [group: string]: ScenarioData[] };
}
