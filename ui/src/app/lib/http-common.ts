import axios from "axios"
import {url} from "@/app/lib/constants"

export default axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json"
  }
})
