import { request } from "@/utils/request"
import { IVehicleApprovalForm, IIslandApplicationVo, IVehicleApprovalQuery } from "@/pages-sub/application-company/types"
export const application = async (data: IVehicleApprovalForm) => {
  const params = {
    ...data
  }
  const result = await request.post("/island-app/application", params)
  console.log('result', result)
  return result
}


export const getList = async (data: IVehicleApprovalForm) => {
  const params = {
    ...data
  }
  const result = await request.post("/island-app/application", params)
  console.log('result', result)
  return result
}

export const getListByLogin = async (query: IVehicleApprovalQuery) => {
  return request.get('/island-app/application/listByLoginUser', query);
}


export const getInfo = async (id: string) => {
  return request.get('/island-app/application/' + id);
}