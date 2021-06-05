import { Template } from "./../types"
import axios, { AxiosResponse } from "axios"
import { appConfig } from "../configs"

const { restEndPoint } = appConfig
const headers = {
  "Content-Type": "application/json",
}

export const getTemplates = (): Promise<AxiosResponse<Template[]>> =>
  axios.get(restEndPoint, { headers })
