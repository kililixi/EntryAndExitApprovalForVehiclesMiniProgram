<template>
  <view class="page-container">
    <wd-message-box />
    <wd-toast />
    <wd-form :model="formData" :rules="rules" ref="formRef">
      <!-- 公司信息 -->
      <wd-cell-group custom-class="group" title="公司信息" border>
        <wd-input
          label="公司名称"
          label-width="100px"
          v-model="formData.companyName"
          placeholder="请输入公司名称"
          clearable
          prop="companyName"
          required
        />
        <wd-input
          label="营业执照号"
          label-width="100px"
          v-model="formData.busiLicence"
          placeholder="请输入营业执照号"
          clearable
          prop="busiLicence"
          required
        />
        <wd-input
          label="法人身份证号"
          label-width="100px"
          v-model="formData.legalPersonIdno"
          placeholder="请输入法人身份证号码"
          clearable
          prop="legalPersonIdno"
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
        <wd-cell title="营业执照" title-width="100px" prop="businessLicense" required>
          <view style="text-align: left">
            <wd-upload
              :limit="1"
              :headers="tempHeader"
              v-model:file-list="businessLicenseList"
              image-mode="aspectFill"
              :action="uploadAction"
              @success="handleUploadSuccess"
            ></wd-upload>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 车辆信息 -->
      <wd-cell-group custom-class="group" :use-slot="true" title="车辆信息" border>
        <template #value>
          <wd-button size="small" type="primary" @click="addVehicle">添加车辆</wd-button>
        </template>
        <view v-for="(vehicle, index) in vehicles" :key="index" class="vehicle-item">
          <wd-picker
            :columns="provinces"
            label="省份"
            v-model="vehicle.province"
            @confirm="(e) => handleProvinceConfirm(e, index)"
          />
          <wd-input
            label="车牌号"
            label-width="100px"
            v-model="vehicle.plateNumber"
            placeholder="请输入燃油车车牌号"
            clearable
            :prop="'vehicles.' + index + '.plateNumber'"
            required
          ></wd-input>
          <wd-cell
            title="行驶证照片"
            title-width="100px"
            :prop="'vehicles.' + index + '.drivingLicense'"
            required
          >
            <view style="text-align: left">
              <wd-upload
                :limit="1"
                v-model:file-list="vehicle.drivingLicenseList"
                image-mode="aspectFill"
                :action="uploadAction"
                @success="(file, fileList) => handleUploadSuccess(file, fileList, index)"
              ></wd-upload>
            </view>
          </wd-cell>
          <view class="">
            <wd-button
              size="small"
              type="icon"
              icon="delete"
              @click="removeVehicle(index)"
              v-if="vehicles.length > 1"
            ></wd-button>
          </view>
          <view class="vehicle-divider" v-if="index !== vehicles.length - 1"></view>
        </view>
        <!-- <view class="text-xs text-gray-500 ml-24">注：仅限燃油车</view> -->
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
        <wd-cell title="附件" title-width="100px">
          <view style="text-align: left">
            <wd-upload
              multiple
              :limit="5"
              v-model:file-list="attachmentsList"
              :action="uploadAction"
              @success="handleAttachmentSuccess"
            ></wd-upload>
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
import { application } from "@/api/application-company/index"
import { startWorkFlow, completeTask } from "@/api/workflow/index"
import provincesData from "./provinces.json"
import pageConfig from "@/config/style.config"
import dayjs from "dayjs"
import { IVehicleApprovalForm, VehicleForm } from "./types"
import { StartProcessBo } from "@/api/types"
import { useToast, useMessage } from "wot-design-uni"
import { globalHeaders } from "@/utils/request"

const messageBox = useMessage()
const toast = useToast()

// 表单引用
const formRef = ref()

// 上传地址
const baseUrl = import.meta.env.VITE_SERVER_BASEURL
const uploadAction = ref(baseUrl + "/resource/oss/upload")

// 文件列表
const businessLicenseList = ref<any[]>([])
const attachmentsList = ref<any[]>([])
const vehicles = ref<any[]>([])

const provinces = ref(provincesData.provinces)

const headers = ref(globalHeaders())
const tempHeader = {
  token: headers.value.Authorization,
  clientid: headers.value.clientid,
}

// 日期限制
const minDate = ref(new Date())
const maxDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date
})

vehicles.value = [
   {
     province: "京",
     plateNumber: "",
     drivingLicense: "",
     drivingLicenseList: [],
   },
 ]

// 表单数据
const formData = reactive<IVehicleApprovalForm>({
  companyName: "",
  busiLicence: "",
  legalPersonIdno: "",
  contactPhone: "",
  startTime: "",
  endTime: "",
  applicationReason: "",
  vehicles: []
})

const submitFormData = ref<StartProcessBo>({
  businessId: "",
  flowCode: "",
  variables: {},
})

// 表单验证规则
const rules = reactive({
  companyName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  busiLicence: [{ required: true, message: "请输入营业执照号", trigger: "blur" }],
  legalPersonIdno_1: [
    { required: true, message: "请输入法人身份证号码", trigger: "blur" },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号码",
      trigger: "blur",
    },
  ],
  contactPhone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
  ],
  businessLicense_1: [{ required: true, message: "请上传营业执照照片", trigger: "change" }],
  "vehicles.*.plateNumber": [
    { required: true, message: "请输入车牌号", trigger: "blur" },
    {
      pattern:
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}$/,
      message: "请输入正确的车牌号",
      trigger: "blur",
    },
  ],
  "vehicles.*.drivingLicense": [{ required: true, message: "请上传行驶证照片", trigger: "change" }],
  startTime: [{ required: true, message: "请选择进岛时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择离岛时间", trigger: "change" }],
  applicationReason: [{ required: true, message: "请输入申请事由", trigger: "blur" }],
})

// 添加车辆
const addVehicle = () => {
  vehicles.value.push({
    province: "京",
    plateNumber: "",
    drivingLicenseImg: "",
    drivingLicenseList: [],
  })
}

// 删除车辆
const removeVehicle = (index: number) => {
  vehicles.value.splice(index, 1)
}

// 上传成功回调
const handleUploadSuccess = (file: any, fileList: any[], index?: number) => {
  console.log("上传成功", file, fileList)
  if (index !== undefined) {
    vehicles.value[index].drivingLicense = file.url
  }
}

// 附件上传成功回调
const handleAttachmentSuccess = (file: any) => {}

// 日期确认回调
const handleConfirm = ({ value }) => {
  if (formData.startTime && formData.endTime) {
    const startDate = dayjs(formData.startTime)
    const endDate = dayjs(formData.endTime)
    const diffDays = endDate.diff(startDate, "day")

    if (diffDays > 7) {
      toast.warning("申请时间不能超过7天")
      formData.endTime = ""
    } else if (diffDays < 0) {
      toast.warning("离岛时间不能早于进岛时间")
      formData.endTime = ""
    }
  }
}

// 省份选择确认回调
function handleProvinceConfirm({ value }, index: number) {
  const vehicle = vehicles.value[index]
  vehicle.province = value

  // 更新车牌号验证规则
  // rules["vehicles." + index + ".plateNumber"][1].pattern = new RegExp(
  //   `^[${value}][A-Z][A-Z0-9]{5}$`,
  // )

  // 更新车牌号
  if (!vehicle.plateNumber) {
    vehicle.plateNumber = value
  } else {
    const firstChar = vehicle.plateNumber.charAt(0)
    if (/[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]/.test(firstChar)) {
      vehicle.plateNumber = value + vehicle.plateNumber.slice(1)
    } else {
      vehicle.plateNumber = value + vehicle.plateNumber
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
      } else if (formData.vehicles.length === 0) {
        toast.warning("车辆信息不能为空")
        return
      }

      messageBox
        .confirm({
          msg: "是否提交申请",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
        .then(() => {
			 uni.showLoading({ title: "提交中..." })
			formData.vehicles = vehicles.value
			
          // 提交申请
          application(formData).then((app: any) => {
			  console.log(app)
			  submitFormData.value.flowCode = "island_vehicle_application"
			  submitFormData.value.businessId = app.data.applicationId
			  
			  startWorkFlow(submitFormData.value)
			    .then((resp: any) => {
			      console.log("resp", resp)
			      completeTask({
			        taskId: resp.data.taskId,
			        messageType: ["1"],
			      }).then(() => {
			        // uni.hideLoading()
			        toast.success("提交成功")
			      })
			    })
			    .catch((err: Error) => {
			      // uni.hideLoading()
			      toast.error("提交失败，请重试")
			    })
          }).catch((err: Error) => {
              toast.error("提交失败，请重试")
              uni.hideLoading()
            })
            .finally(() => {
              uni.hideLoading()
            })
        })
        .catch(() => {
          // 用户取消提交
		   toast.show("取消提交操作")
        })
    } else {
      console.log("表单验证失败", errors)
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
  background-color: #f5f5f5;
}

.group {
  margin-bottom: 20px;
}

.vehicle-item {
  position: relative;
  padding: 0 8px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.vehicle-actions {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
}

.add-vehicle {
  padding: 8px;
  text-align: center;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle-divider {
  height: 1px;
  background-color: #ebedf0;
  margin: 4px 0;
}
</style>
