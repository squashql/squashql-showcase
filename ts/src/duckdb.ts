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
  // Create 3 new tables from Google Sheets and generate ./tables.ts file that contain their metadata
  duckDb.createTable("portfolio", "17QFM8B9E0vRPb6v9Ct2zPKobFWWHia53Odfu1LChAY0", "446626508").then(r => console.log(r))
  duckDb.createTable("spending", "1WujqnAJXrRGvfzSYKF_uyHhacehbpuOiJ2ygcb5-AYQ", "0").then(r => console.log(r))
  duckDb.createTable("population", "1WujqnAJXrRGvfzSYKF_uyHhacehbpuOiJ2ygcb5-AYQ", "1150075574").then(r => console.log(r))
  duckDb.showTables().then(r => console.log(r))
  codeGenerateTablesFile(duckDb)
}
