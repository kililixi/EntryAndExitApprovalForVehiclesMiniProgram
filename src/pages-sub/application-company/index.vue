<template>
  <view class="page-container">
    <wd-message-box />
    <wd-toast />
    <wd-form :model="formData" :rules="rules" ref="formRef">
      <!-- 基本信息 -->
      <wd-cell-group custom-class="group" title="基本信息" border>
        <wd-input
          label="姓名"
          label-width="100px"
          v-model="formData.individualName"
          placeholder="请输入姓名"
          clearable
          prop="name"
          required
        />
        <wd-input
          label="身份证号码"
          label-width="100px"
          v-model="formData.individualIdno"
          placeholder="请输入身份证号码"
          clearable
          prop="idCard"
          required
        />
        <wd-input
          label="联系方式"
          label-width="100px"
          v-model="formData.contactPhone"
          placeholder="请输入手机号码"
          clearable
          prop="contactPhone"
          required
        />
      </wd-cell-group>

      <!-- 身份证照片 -->
      <wd-cell-group title="身份证照片" border>
        <wd-cell title="身份证正面" title-width="100px" prop="idCardFront" required>
          <view style="text-align: left">
            <wd-upload
			  :limit="1"
			  :headers="tempHeader"
              v-model:file-list="idCardFrontList"
              image-mode="aspectFill"
              :action="uploadAction"
			   @success="handleUploadSuccess"
            ></wd-upload>
          </view>
        </wd-cell>
        <wd-cell title="身份证反面" title-width="100px" prop="idCardBack" required>
          <wd-upload
		    :limit="1"
            v-model:file-list="idCardBackList"
            image-mode="aspectFill"
            :action="uploadAction"
			 @success="handleUploadSuccess"
          ></wd-upload>
        </wd-cell>
      </wd-cell-group>

      <!-- 车辆信息 -->
      <wd-cell-group custom-class="group" title="车辆信息" border>
        <wd-picker
          :columns="provinces"
          label="省份"
          v-model="selectProvince"
          @confirm="handleProvinceConfirm"
        />
        <wd-input
          label="车牌号"
          label-width="100px"
          v-model="formData.plateNumber"
          placeholder="请输入燃油车车牌号"
          clearable
          prop="plateNumber"
          required
        >
          <!-- <template #prefix>
				<wd-text type="primary" :text="selectProvince"></wd-text>
			</template> -->
        </wd-input>
        <view class="text-xs text-gray-500 ml-24">注：仅限燃油车</view>
        <wd-cell title="行驶证照片" title-width="100px" prop="drivingLicense" required>
          <view style="text-align: left">
            <wd-upload
			  :limit="1"
              v-model:file-list="fileList"
              image-mode="aspectFill"
              :action="uploadAction"
			  @success="handleUploadSuccess"
            ></wd-upload>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 申请信息 -->
      <wd-cell-group custom-class="group" title="申请信息" border>
        <wd-calendar
          label="进岛时间"
          type="datetime"
          v-model="formData.startTime"
          @confirm="handleConfirm"
          required
        />
        <wd-calendar
          label="离岛时间"
          type="datetime"
          v-model="formData.endTime"
          @confirm="handleConfirm"
          required
        />
        <view class="text-xs text-gray-500 ml-24">注：申请时间不超过7天</view>
        <wd-textarea
          label="申请事由"
          label-width="100px"
          v-model="formData.applicationReason"
          placeholder="请输入申请事由"
          :rows="4"
          :maxlength="200"
          show-word-limit
          prop="applicationReason"
          required
        />
      </wd-cell-group>

      <!-- 附件上传 -->
      <!--  <wd-cell-group custom-class="group" title="相关附件" border>
        <wd-cell title="附件" title-width="100px" prop="attachments">
          <view style="text-align: left">
          </view>
        </wd-cell>
      </wd-cell-group> -->

      <!-- 提交按钮 -->
      <view class="footer">
        <wd-button type="primary" size="large" @click="submitForm" block>提交申请</wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue"
import { application } from "@/api/application/index"
import { startWorkFlow, completeTask } from "@/api/workflow/index"
import provincesData from "./provinces.json"
import pageConfig from "@/config/style.config"
import dayjs from "dayjs"
import { IVehicleApprovalForm } from "./types"
import { StartProcessBo } from "@/api/types"
import { useToast, useMessage } from "wot-design-uni"
import { globalHeaders } from '@/utils/request'

const messageBox = useMessage()
const toast = useToast()

// 表单引用
const formRef = ref()

// 上传地址（实际项目中需要替换为真实的上传地址）

const baseUrl = import.meta.env.VITE_SERVER_BASEURL
const uploadAction = ref(baseUrl + '/resource/oss/upload');

const fileList = ref<any[]>([])
const idCardFrontList = ref<any[]>([])
const idCardBackList = ref<any[]>([])

const provinces = ref(provincesData.provinces)
const selectProvince = ref("京")

const headers = ref(globalHeaders());
console.log('headers', headers)
const tempHeader = {
	"token": headers.value.Authorization,
	"clientid": headers.value.clientid,
	"aaa": "aaaa"
}

// 日期限制
const minDate = ref(new Date())
const maxDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 30) // 最多可以选择30天后的日期
  return date
})

// 表单数据
const formData = reactive<IVehicleApprovalForm>({
  individualName: "",
  individualIdno: "",
  contactPhone: "",
  idCardFront: "",
  idCardBack: "",
  plateNumber: "",
  drivingLicense: "",
  startTime: "",
  endTime: "",
  applicationReason: "",
  // attachments: [],
})

const submitFormData = ref<StartProcessBo>({
  businessId: "",
  flowCode: "",
  variables: {},
})

const dateRange = ref<number[]>([])

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  idCard_1: [
    { required: true, message: "请输入身份证号码", trigger: "blur" },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号码",
      trigger: "blur",
    },
  ],
  phone_1: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
  ],
  idCardFront_1: [{ required: true, message: "请上传身份证正面照片", trigger: "change" }],
  idCardBack_1: [{ required: true, message: "请上传身份证反面照片", trigger: "change" }],
  plateNumber_1: [
    { required: true, message: "请输入车牌号", trigger: "blur" },
    {
      pattern:
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}$/,
      message: "请输入正确的车牌号",
      trigger: "blur",
    },
  ],
  drivingLicense_1: [{ required: true, message: "请上传行驶证照片", trigger: "change" }],
  startTime: [{ required: true, message: "请选择进岛时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择离岛时间", trigger: "change" }],
  applicationReason: [{ required: true, message: "请输入申请事由", trigger: "blur" }],
})

// 上传前验证
const beforeUpload = (file: File) => {
  // 验证文件类型和大小
  const isImage = file.type.indexOf("image") !== -1
  const isPDF = file.type === "application/pdf"
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage && !isPDF) {
    toast.warning("只能上传图片")
    // uni.showToast({
    //   title: "只能上传图片或PDF文件",
    //   icon: "none",
    // })
    return false
  }

  if (!isLt5M) {
    toast.warning("文件大小不能超过5MB")
    // uni.showToast({
    //   title: "文件大小不能超过5MB",
    //   icon: "none",
    // })
    return false
  }

  return true
}

// 上传成功回调
const handleUploadSuccess = (file: any, fileList: any[], formData: any) => {
  console.log("上传成功", file, fileList, formData)
}

const handleConfirm2 = ({ value }) => {
  console.log(value)
}

// 日期确认回调
const handleConfirm = ({ value }) => {
  console.log(value)
  // 当两个时间都已选择时，进行时间差验证
  if (formData.startTime && formData.endTime) {
    const startDate = dayjs(formData.startTime)
    const endDate = dayjs(formData.endTime)
    const diffDays = endDate.diff(startDate, "day")
    console.log("时间差(天):", diffDays)

    if (diffDays > 7) {
      toast.warning("申请时间不能超过7天")
      formData.endTime = ""
    } else if (diffDays < 0) {
      toast.warning("离岛时间不能早于进岛时间")
      formData.endTime = ""
    }
  }
}

function handleProvinceConfirm({ value }) {
  selectProvince.value = value
  // 更新车牌号验证规则
  rules.plateNumber_1[1].pattern = new RegExp(`^[${value}][A-Z][A-Z0-9]{5}$`)

  // 根据车牌号输入状态更新车牌号
  if (!formData.plateNumber) {
    // 如果车牌号为空，直接设置为选择的省份
    formData.plateNumber = value
  } else {
    // 判断第一个字符是否为省份简称
    const firstChar = formData.plateNumber.charAt(0)
    if (/[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]/.test(firstChar)) {
      // 如果是省份简称，替换为新选择的省份
      formData.plateNumber = value + formData.plateNumber.slice(1)
    } else {
      // 如果不是省份简称，在前面添加省份
      formData.plateNumber = value + formData.plateNumber
    }
  }
}

// 提交表单
const submitForm = () => {
  formRef.value.validate().then(({ valid, errors }) => {
    if (valid) {
      // 验证日期范围
      if (formData.startTime && formData.endTime) {
        const startDate = dayjs(formData.startTime)
        const endDate = dayjs(formData.endTime)
        const diffDays = endDate.diff(startDate, "day")

        if (diffDays > 7) {
          toast.warning("申请时间不能超过7天")
          return
        } else if (diffDays < 0) {
          toast.warning("离岛时间不能早于进岛时间")
          return
        }
      } else if (!formData.startTime || !formData.endTime) {
        toast.warning("请选择进岛和离岛时间")
        return
      }

      // 提交表单数据
      console.log("提交的表单数据", formData)

      messageBox
        .confirm({
          msg: "是否提交申请",
          title: "提示",
        })
        .then(() => {
          uni.showLoading({ title: "提交中..." })
          application(formData)
            .then((app) => {
              console.log(app)
              submitFormData.value.flowCode = "island_vehicle_application"
              submitFormData.value.businessId = app.data.applicationId
              //流程变量
              // taskVariables.value = {
              //   leaveDays: data.leaveDays,
              //   userList: ['1', '3', '4']
              // };
              // submitFormData.value.variables = taskVariables.value;
              startWorkFlow(submitFormData.value)
                .then((resp) => {
                  console.log("resp", resp)
                  completeTask({
                    taskId: resp.data.taskId,
                    messageType: ["1"],
                  }).then((taskRet) => {
                    console.log("taskRet", taskRet)
                    // uni.hideLoading()
                    toast.success("提交成功")
                  })
                })
                .catch((err) => {
                  // uni.hideLoading()
                  toast.error("提交失败，请重试")
                })
            })
            .catch((err) => {
              toast.error("提交失败，请重试")
              uni.hideLoading()
            })
            .finally(() => {
              uni.hideLoading()
            })
        })
        .catch(() => {
          toast.show("取消提交操作")
        })
    } else {
      console.log("表单验证失败")
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

.inline-txt {
  display: inline-block;
  font-size: 14px;
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.45);
  vertical-align: middle;
}
:deep(.group) {
  margin-top: 12px;
}
.tip {
  margin: 10px 15px 21px;
  color: #999;
  font-size: 12px;
}
.footer {
  margin-top: 15px;
  padding: 0 25px 21px;
}
:deep(.label-class) {
  color: #999 !important;
  font-size: 12px !important;
}
</style>
