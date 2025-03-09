/**
 * 维护一些ts类型
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

export interface StartProcessBo {
  businessId: string | number;
  flowCode: string;
  variables: any;
}

export interface startWorkFlowResult {
  processInstanceId: string;
  taskId: string;
}
