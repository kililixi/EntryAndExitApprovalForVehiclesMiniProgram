/**
 * 一键授权登录接口
 */

export interface IMiniWxLoginParams {
  /* 小程序appid */
  appid: string

  /* 临时登录code */
  loginCode: string

  /* 获取手机号code */
  telephoneCode: string
}

export interface IMiniWxLoginRes {
  /* */
  secretKey: string

  /* */
  telephone: string

  /* */
  token: string

  /* 设备标识 */
  userDeviceIdentify: string

  /* */
  userId: number
}

/**
 * 登录响应
 */
export interface LoginResult {
  access_token: string;
}

/**
 * 登录请求
 */
export interface LoginData {
  tenantId?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
  socialCode?: string;
  socialState?: string;
  source?: string;
  code?: string;
  uuid?: string;
  clientId: string;
  grantType: string;
}
