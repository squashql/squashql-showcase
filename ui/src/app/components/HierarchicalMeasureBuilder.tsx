import React, {useState} from "react"
import {comparisonMeasureWithGrandTotal, ComparisonMethod, integer, Measure, multiply} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import {
  CompareWithGrandTotalAlongAncestors,
  MeasureProviderType,
  PercentOfParentAlongAncestors
} from "@/app/lib/queries"
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
  GrandTotal = "% on grand total",
  ParentOnRows = "% of parent of row",
  TotalOnRows = "% of row",
  ParentOnColumns = "% of parent of column",
  TotalOnColumns = "% of column"
}

function hierarchicalTypeToHumanReadableString(type: HierarchicalType | undefined): string | undefined {
  return Object.values(HierarchicalType)
          .filter(a => a === type)
          .filter(isString)[0]
}

const initialState = {
  alias: "",
}

const isString = (item: string | undefined): item is string => {
  return !!item
}

// Last filter to indicate to TS compiler that array does not contain any undefined
const availableTypes = Object.values(HierarchicalType).map(a => hierarchicalTypeToHumanReadableString(a)).filter(isString)

export default function HierarchicalMeasureBuilder(props: HierarchicalMeasureBuilderProps) {
  const [state, setState] = useState<HierarchicalMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    if (state.underlyingMeasure) {
      let measure
      switch (state.type) {
        case HierarchicalType.GrandTotal:
          measure = multiply(state.alias, comparisonMeasureWithGrandTotal("__" + state.alias + "__", ComparisonMethod.DIVIDE, state.underlyingMeasure), integer(100))
          break
        case HierarchicalType.ParentOnRows:
          measure = new PercentOfParentAlongAncestors(state.alias, state.underlyingMeasure, "column")
          break
        case HierarchicalType.TotalOnRows:
          measure = new CompareWithGrandTotalAlongAncestors(state.alias, state.underlyingMeasure, "column")
          break
        case HierarchicalType.ParentOnColumns:
          measure = new PercentOfParentAlongAncestors(state.alias, state.underlyingMeasure, "row")
          break
        case HierarchicalType.TotalOnColumns:
          measure = new CompareWithGrandTotalAlongAncestors(state.alias, state.underlyingMeasure, "row")
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

  function suggestedAlias(underlyingMeasure: Measure | undefined, type: HierarchicalType | undefined): string {
    if (state.alias === "" && underlyingMeasure && type) {
      return underlyingMeasure.alias + " - " + hierarchicalTypeToHumanReadableString(type)
    } else {
      return state.alias
    }
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
                    <h1 className="modal-title fs-5" id="hiercompModalLabel">Hierarchical comparison</h1>
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
                                        const underlyingMeasure = props.measures[index]
                                        setState((prevState) => {
                                          return {
                                            ...state,
                                            underlyingMeasure,
                                            alias: suggestedAlias(underlyingMeasure, prevState.type)
                                          }
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
                                        const type = Object.values(HierarchicalType)[index]
                                        setState((prevState) => {
                                          return {
                                            ...state,
                                            type,
                                            alias: suggestedAlias(prevState.underlyingMeasure, type)
                                          }
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
