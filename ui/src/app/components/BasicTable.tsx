import {s2Palette} from "@/app/components/PivotTable"
import {SheetComponent, SheetComponentOptions} from "@antv/s2-react"
import {S2DataConfig} from "@antv/s2"

interface BasicTableProps {
  dataCfg: S2DataConfig,
  options: SheetComponentOptions
}

export default function BasicTable(props: BasicTableProps) {

  return (
          <SheetComponent sheetType="table"
                          dataCfg={props.dataCfg}
                          themeCfg={{palette: s2Palette}}
                          options={props.options}/>
  )
}
