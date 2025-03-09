/**
 * 车辆进出岛申请表单数据接口
 */


export interface IVehicleApprovalForm {
  /** 姓名 */
  individualName?: string
  /** 身份证号码 */
  individualIdno?: string
  /** 公司名称 */
  companyName?: string
  /** 营业执照号 */
  busiLicence?: string
  /** 法人身份证号 */
  legalPersonIdno?: string
  /** 联系方式 */
  contactPhone: string
  /** 身份证正面照片 */
  idCardFront: ''
  /** 身份证反面照片 */
  idCardBack: ''
  /** 车牌号 */
  plateNumber: string
  /** 行驶证照片 */
  drivingLicense: ''
  /** 进岛时间 */
  startTime: string
  /** 离岛时间 */
  endTime: string
  /** 申请事由 */
  applicationReason: string
  /** 附件 */
  // attachments: IUploadFile[]
}

/**
 * 上传文件接口
 */
export interface IUploadFile {
  /** 文件名 */
  name?: string
  /** 文件URL */
  url?: string
  /** 文件类型 */
  type?: string
  /** 文件大小 */
  size?: number
  /** 上传状态 */
  status?: 'ready' | 'uploading' | 'success' | 'error'
  /** 上传进度 */
  progress?: number
  /** 文件唯一标识 */
  uid?: string
  /** 响应数据 */
  response?: any
}

/**
 * 表单验证规则接口
 */
export interface IFormRule {
  /** 是否必填 */
  required?: boolean
  /** 错误提示消息 */
  message?: string
  /** 触发验证的时机 */
  trigger?: 'blur' | 'change' | string
  /** 正则表达式 */
  pattern?: RegExp
}

/**
 * 车辆进出岛申请提交请求接口
 */
export interface IVehicleApprovalSubmitRequest extends Omit<IVehicleApprovalForm, 'idCardFront' | 'idCardBack' | 'drivingLicense' | 'attachments'> {
  /** 身份证正面照片ID */
  idCardFrontId?: string
  /** 身份证反面照片ID */
  idCardBackId?: string
  /** 行驶证照片ID */
  drivingLicenseId?: string
  /** 附件ID列表 */
  attachmentIds?: string[]
}

/**
 * 车辆进出岛申请提交响应接口
 */
export interface IVehicleApprovalSubmitResponse {
  /** 是否成功 */
  success: boolean
  /** 申请ID */
  applicationId?: string
  /** 错误信息 */
  message?: string
  /** 错误码 */
  code?: number
}

/**
 * 车辆进出岛申请VO接口
 */
export interface IIslandApplicationVo {
  /** 申请ID */
  applicationId?: number
  /** 公司ID */
  companyId?: number
  /** 提交的法人身份证号 */
  legalPersonId?: string
  /** 申请开始时间 */
  startTime?: string
  /** 申请结束时间 */
  endTime?: string
  /** 申请事由 */
  applicationReason?: string
  /** 审批状态（pending/rejected/approved） */
  status?: string
  /** 申请人类型 */
  applicantType?: string
  /** 联系电话 */
  contactPhone?: string
  /** 申请时的公司名称 */
  companyName?: string
  /** 申请时的营业执照号 */
  busiLicence?: string
  /** 申请时的法人身份证号 */
  legalPersonIdno?: string
  /** 申请人姓名 */
  individualName?: string
  /** 申请人身份证号 */
  individualIdno?: string
}

export interface IVehicleApprovalQuery {
	pageNum: number
	pageSize: number
}

export interface VehicleVO {
  /**
   * 记录ID
   */
  vehicleId: string | number;

  /**
   * 申请ID
   */
  applicationId: string | number;

  /**
   * 车牌号码
   */
  plateNumber: string;

  /**
   * 车辆类型（如：轿车、SUV、货车等）
   */
  vehicleType: string;

  /**
   * 品牌（如：大众、丰田等）
   */
  brand: string;

  /**
   * 型号
   */
  model: string;

  /**
   * 颜色
   */
  color: string;

  /**
   * 车辆照片路径
   */
  vehicleImg: string;
}


export interface VehicleQuery {
  /**
   * 申请ID
   */
  applicationId?: string | number;

  /**
   * 车牌号码
   */
  plateNumber?: string;

  /**
   * 车辆类型（如：轿车、SUV、货车等）
   */
  vehicleType?: string;

  /**
   * 品牌（如：大众、丰田等）
   */
  brand?: string;

  /**
   * 型号
   */
  model?: string;

  /**
   * 颜色
   */
  color?: string;

  /**
   * 车辆照片路径
   */
  vehicleImg?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}