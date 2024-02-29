import React, {useState} from "react"
import {comparisonMeasureWithGrandTotal, ComparisonMethod, integer, Measure, multiply} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import {PercentOfParentAlongAncestors} from "@/app/lib/queries"
import {MeasureProviderType} from "@/app/lib/queryProvider"
import {CompareWithGrandTotalAlongAncestors} from "@/app/spending/spending"
import FloatingSelect from "@/app/components/FloatingSelect"
import FloatingInputText from "@/app/components/FloatingInputText"

interface HierarchicalMeasureBuilderProps {
  measures: Measure[]
  onNewMeasure: (m: Measure | MeasureProviderType) => void
}

interface HierarchicalMeasureBuilderState {
  underlyingMeasure?: Measure
  alias: string | ""
  type?: HierarchicalType
}

enum HierarchicalType {
  GrandTotal = "% on Grand Total",
  ParentOnRows = "% of parent on rows",
  TotalOnRows = "% on rows",
  ParentOnColumns = "% of parent on columns",
  TotalOnColumns = "% on columns"
}

function hierarchicalTypeToHumanReadableString(type: HierarchicalType | undefined): string | undefined {
  switch (type) {
    case HierarchicalType.GrandTotal:
      return "% on Grand Total"
    case HierarchicalType.ParentOnRows:
      return "% of parent on rows"
    case HierarchicalType.TotalOnRows:
      return "% on rows"
    case HierarchicalType.ParentOnColumns:
      return "% of parent on columns"
    case HierarchicalType.TotalOnColumns:
      return "% on columns"
  }
}

const initialState = {
  alias: "",
}

const isString = (item: string | undefined): item is string => {
  return !!item
}
const availableTypes = Object.values(HierarchicalType).map(a => hierarchicalTypeToHumanReadableString(a)).filter(isString)

export default function HierarchicalMeasureBuilder(props: HierarchicalMeasureBuilderProps) {
  const [state, setState] = useState<HierarchicalMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    if (state.underlyingMeasure) {
      let measure
      switch (state.type) {
        case HierarchicalType.GrandTotal:
          measure = multiply(state.alias + " - % of Grand Total", comparisonMeasureWithGrandTotal("__" + state.alias + "__", ComparisonMethod.DIVIDE, state.underlyingMeasure), integer(100))
          break
        case HierarchicalType.ParentOnRows:
          measure = new PercentOfParentAlongAncestors(state.alias + " - % parent on rows", state.underlyingMeasure, "row")
          break
        case HierarchicalType.TotalOnRows:
          measure = new CompareWithGrandTotalAlongAncestors(state.alias + " - % on rows", state.underlyingMeasure, "row")
          break
        case HierarchicalType.ParentOnColumns:
          measure = new PercentOfParentAlongAncestors(state.alias + " - % parent on columns", state.underlyingMeasure, "column")
          break
        case HierarchicalType.TotalOnColumns:
          measure = new CompareWithGrandTotalAlongAncestors(state.alias + " - % on columns", state.underlyingMeasure, "column")
          break
      }

      if (measure) {
        props.onNewMeasure(measure)
        setState(initialState) // Clear everything
      }
    }
  }

  function canBuildMeasure(): boolean {
    return state.underlyingMeasure !== undefined && state.type !== undefined && state.alias !== ""
  }

  return (
          <div>
            <button type="button" className="btn btn-sm btn-light" data-bs-toggle="modal"
                    data-bs-target="#hiercompModal">
              Hierarchical comparison
            </button>

            <div className="modal fade" id="hiercompModal"
                 tabIndex={-1}
                 aria-labelledby="hiercompModalLabel"
                 aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="hiercompModalLabel">Time period comparison</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">

                    {/*measure*/}
                    <div className="pb-1">
                      <FloatingSelect label={"measure"}
                                      value={state.underlyingMeasure?.alias}
                                      fields={props.measures}
                                      onChange={event => {
                                        const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                                        setState({
                                          ...state,
                                          underlyingMeasure: props.measures[index]
                                        })
                                      }}/>
                    </div>

                    {/*type*/}
                    <div className="pb-1">
                      <FloatingSelect label={"type"}
                                      value={hierarchicalTypeToHumanReadableString(state.type)}
                                      fields={availableTypes}
                                      onChange={event => {
                                        const index = availableTypes.indexOf(event.target.value)
                                        setState({
                                          ...state,
                                          type: Object.values(HierarchicalType)[index]
                                        })
                                      }}/>
                    </div>

                    {/*alias*/}
                    <div className="pb-1">
                      <FloatingInputText textValue={state.alias}
                                         onChange={event => {
                                           setState({
                                             ...state,
                                             alias: event.target.value
                                           })
                                         }}/>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                            disabled={!canBuildMeasure()} onClick={createMeasureFromState}>Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}
