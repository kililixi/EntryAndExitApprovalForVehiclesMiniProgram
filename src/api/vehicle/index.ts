import { request } from "@/utils/request"
import { VehicleVO, VehicleQuery } from "@/pages-sub/application/types"

export const listVehicle = (query?: VehicleQuery): Promise<ApiResult<VehicleVO>>  => {
  return request.get('/island-app/vehicle/list', query);
};


export const getInfo = async (id: string) => {
  return request.get('/island-app/vehicle/' + id);
}