import { request } from "@/utils/request"
import { IMiniWxLoginParams, IMiniWxLoginRes, LoginData, LoginResult, UserInfo } from "@/pages/login/types"
export interface LoginParams {
  systemCode: string
  appid: string
  loginCode: string
  telephoneCode: string
}

const clientId = "e5cd7e4891bf95d1d19206ce24a7b32e"

/** 微信授权登录 */
export const loginByWechatApi = (data?: IMiniWxLoginParams) => {
  return request.post<IMiniWxLoginRes>("/api/weChatlogin", data)
}

export const login = async (data: LoginData) => {
  const params = {
    ...data,
    clientId: data.clientId || clientId,
    grantType: data.grantType || "password",
  }
  const result = await request.postEncrypt<LoginResult>("/auth/login", params)
  console.log('result', result)
  return result
}

/**
 * 注销
 */
export function logout() {
  return request.post("/auth/logout")
}

/**
 * 获取用户详细信息
 */
export function getInfo() {
  return request.get<UserInfo>("/system/user/getInfo")
}
