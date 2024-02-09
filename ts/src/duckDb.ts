import axios, {AxiosInstance} from "axios"
import {CreateAxiosDefaults} from "axios/index"
import {Client, TableType} from "@squashql/squashql-codegen"
import {url} from "./constants"
import {codeGenerateTablesFile} from "@squashql/squashql-codegen/build"

export class DuckDb implements Client {

  axiosInstance: AxiosInstance

  constructor(private url: string, config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create({
      baseURL: url,
      timeout: 30_000,
      ...config
    })
  }

  async getTablesInfo(options?: any): Promise<TableType[]> {
    return this.axiosInstance
            .post("/tables-info")
            .then(r => r.data)
  }

  async showTables(): Promise<String> {
    return this.axiosInstance
            .post("/show-tables")
            .then(r => r.data)
  }

  async createTable(tableName: string, id: string, gid: string): Promise<TableType[]> {
    return this.axiosInstance
            .post(`/gs-load?tablename=${tableName}&id=${id}&gid=${gid}`)
            .then(r => r.data)
  }

  async dropTable(tableName: string): Promise<string> {
    return this.axiosInstance
            .post(`/drop?tablename=${tableName}`)
            .then(r => r.data)
  }
}

if (require.main === module) {
  const duckDb = new DuckDb(url)
  codeGenerateTablesFile(duckDb)
}
