import {
  all,
  ConditionType, count,
  criterion,
  eq,
  from, ge,
  JoinType, lt,
  neq,
  Querier,
  sumIf,
  TableField,
} from "@squashql/squashql-js"
import {VirtualTable} from "@squashql/squashql-js/dist/virtualtable";
import {criterion_} from "@squashql/squashql-js/dist/conditions";

console.log('Hello world!')

const querier = new Querier("http://localhost:8080")

const expenditure = sumIf("Expenditure", "Amount", criterion("Income / Expenditure", neq("Income")))

const records = [
  ["neutral", 0, 2],
  ["happy", 2, 4],
  ["very happy", 4, 5],
];
const satisfactionLevels = new VirtualTable("satisfactionLevels", ["satisfaction_level", "lower_bound", "upper_bound"], records)

const query = from("budget")
        .joinVirtual(satisfactionLevels, JoinType.INNER)
        .on(all([
          criterion_("Happiness score", "satisfactionLevels.lower_bound", ConditionType.GE),
          criterion_("Happiness score", "satisfactionLevels.upper_bound", ConditionType.LT)
        ]))
        .where(
                all([
                  criterion("Scenario", eq("b")),
                  criterion("Year", eq(2023)),
                ]))
        .select(["Year", "satisfaction_level"], [], [expenditure])
        // .select(["Year", "Happiness score"], [], [expenditure])
        .build()
querier.execute(query, undefined, true)
        .then(r => console.log(r));

//
// const query = from("budget")
//         .joinVirtual(satisfactionLevels, JoinType.INNER)
//         .on(all([
//           // criterion(new TableField("Happiness score"), "satisfactionLevels.lower_bound", ConditionType.GE),
//           criterion_("Happiness score", "satisfactionLevels.lower_bound", ConditionType.GE),
//           criterion_("Happiness score", "satisfactionLevels.upper_bound", ConditionType.LT)
//         ]))
//         .where(
//                 all([
//                   criterion("Scenario", eq("b")),
//                   criterion("Year", eq(2023)),
//                 ]))
//         .select(["Year", "satisfaction_level"], [], [expenditure])
//         .build()
