<template>
  <view class="page-container">
    <wd-cell-group title="基本信息" border>
      <wd-cell title="公司名称" :value="data.companyName" />
      <wd-cell title="营业执照号" :value="data.busiLicence" />
	  <wd-cell title="营业执照照片" center>
	    <wd-img :width="100" :height="100" src="https://www.123.com/a.jpg">
	      <template #error>
	        <view class="error-wrap">加载失败</view>
	      </template>
	      <template #loading>
	        <view class="loading-wrap">
	          <wd-loading />
	        </view>
	      </template>
	    </wd-img>
	  </wd-cell>
	  <wd-cell title="法人姓名" :value="data.legalPersonName" />
	  <wd-cell title="法人身份证号码" >
		  <text>{{ getMaskedIdno(data.legalPersonIdno) }}</text>
		  <wd-button size="small" custom-style="margin-left: 10px" @click="toggleIdnoMask">
		    {{ idnoMasked ? "显示" : "隐藏" }}
			</wd-button>
		</wd-cell>
	  <wd-cell title="联系方式" :value="data.contactPhone" />
      <wd-cell title="进岛时间" :value="data.startTime"></wd-cell>
      <wd-cell title="离岛时间" :value="data.endTime"></wd-cell>
      <wd-cell title="审批进度" center>
        <wd-tag custom-class="space" :type="getStatusType(data.status)">
          {{ getStatusText(data.status) }}
        </wd-tag>
      </wd-cell>
    </wd-cell-group>

    <wd-cell-group title="车辆信息" border>
      <view v-for="(item, index) in vehicleList" :key="index">
        <wd-cell title="车牌号" :value="item.plateNumber" />
        <!-- driving_license_img -->
        <wd-cell title="车辆行驶证" center>
          <wd-img :width="100" :height="100" src="https://www.123.com/a.jpg">
            <template #error>
              <view class="error-wrap">加载失败</view>
            </template>
            <template #loading>
              <view class="loading-wrap">
                <wd-loading />
              </view>
            </template>
          </wd-img>
        </wd-cell>
      </view>
    </wd-cell-group>

    <wd-cell-group title="其他信息" border>
      <wd-cell title="申请理由" :value="data.applicationReason" center></wd-cell>
    </wd-cell-group>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getInfo } from "@/api/application/index"
import { listVehicle } from "@/api/vehicle/index"
import { IIslandApplicationVo, VehicleVO, VehicleQuery } from "@/pages-sub/application/types"
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

// 身份证号码脱敏状态
const idnoMasked = ref<boolean>(true)

// 身份证号码脱敏处理
const getMaskedIdno = (idno: string | undefined) => {
  if (!idno) return ""
  return idnoMasked.value ? idno.replace(/^(.{4})(.*)(.{4})$/, "$1********$3") : idno
}

// 切换身份证号码显示状态
const toggleIdnoMask = () => {
  idnoMasked.value = !idnoMasked.value
}

const getStatusType = (status: string): "success" | "warning" | "primary" | "danger" => {
  const statusMap: Record<string, "success" | "warning" | "primary" | "danger"> = {
    draft: "warning",
    waiting: "primary",
    finish: "success",
    invalid: "danger",
    back: "danger",
    termination: "danger",
    cancel: "danger",
  }
  return statusMap[status] || "primary"
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    cancel: "已撤销",
    draft: "草稿",
    waiting: "审核中",
    finish: "已完成",
    invalid: "已作废",
    back: "已退回",
    termination: "已终止",
  }
  return statusMap[status] || "未知状态"
}

const data = ref<IIslandApplicationVo>({})
const vehicleList = ref<VehicleVO[]>([])

const vehicleQuery: VehicleQuery = {
  applicationId: undefined,
}

const props = defineProps({
  id: String,
})
console.log("id=" + props.id) // id=1

const initData = async () => {
  const application = await getInfo(props.id)
  console.log("application", application)
  data.value = application.data
  vehicleQuery.applicationId = props.id
  const result = await listVehicle(vehicleQuery)
  vehicleList.value = result.rows
  console.log("vvv", vehicleList.value)
}

onMounted(async () => {
  initData()
})

// onShow( () => {
// 	initData()
// })
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 0; /* 移除底部间距，因为已经有tabbar了 */
  padding-top: 0; /* 移除顶部间距 */
  position: relative;
  overflow-y: auto; /* 允许内容滚动 */

  :deep(.wd-cell-group) {
    margin: 12px 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.error-wrap {
  width: 100%;
  height: 100%;
  background-color: red;
  color: white;
  line-height: 100px;
  text-align: center;
}

.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.space) {
  padding: 5px 10px !important;
}
</style>
