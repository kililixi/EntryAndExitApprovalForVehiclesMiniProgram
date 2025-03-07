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
  access_token: string
}

/**
 * 登录请求
 */
export interface LoginData {
  tenantId?: string
  username?: string
  password?: string
  rememberMe?: boolean
  socialCode?: string
  socialState?: string
  source?: string
  code?: string
  uuid?: string
  clientId: string
  grantType: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  user: UserVO
  roles: string[]
  permissions: string[]
}

/**
 * 用户返回对象
 */
export interface UserVO {
  userId: string | number
  unitId: number
  deptId: number
  userName: string
  nickName: string
  userType: string
  email: string
  phonenumber: string
  sex: string
  avatar: string
  status: string
  delFlag: string
  loginIp: string
  loginDate: string
  remark: string
  deptName: string
  unitName: string
  roleIds: any
  postIds: any
  roleId: any
  admin: boolean
}
