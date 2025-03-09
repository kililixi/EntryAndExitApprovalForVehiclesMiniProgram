<template>
    <wd-table height="100vh" :data="data" :fixed-header="false" :ellipsis="false" >
      <wd-table-col prop="plateNumber" :width="120" label="车牌号" align="center"></wd-table-col>
	  <wd-table-col prop="status" label="状态" align="center">
		  <template #value="{row}">
			<view class="custom-class">
			  <wd-tag custom-class="space" :type="getStatusType(row.status)">
				{{ getStatusText(row.status) }}
			  </wd-tag>
			  </view>
		  </template>
	  </wd-table-col>
	  <wd-table-col prop="startTime" label="时间" align="center">
	  <template #value="{row}">
	    <view class="custom-class">
	      {{ dayjs(row.startTime).format('YYYYMMDD') }}-{{ dayjs(row.endTime).format('YYYYMMDD') }}
	    </view>
	  </template>
	  </wd-table-col>
	  <wd-table-col prop="applicationId" label="操作" fixed align="center">
		<template #value="{row}">
		  <view class="custom-class">
			<wd-button size="small" @click="toDetail(row.applicationId)">详细</wd-button>
		  </view>
		</template>
	  </wd-table-col>
    </wd-table>
    <wd-pagination custom-style="border: 1px solid #ececec;border-top:none" v-model="page" :total="total" @change="handleChange"></wd-pagination>
</template>

<script setup lang="ts">
import { ref } from "vue"
import dayjs from 'dayjs'
import { getListByLogin } from '@/api/application/index'
import { IIslandApplicationVo } from "@/pages-sub/application/types"
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

const page = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)

const data = ref<IIslandApplicationVo[]>([])

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

const toDetail = (applicatioId: string) => {
	uni.navigateTo({
		url: '/pages-sub/application/detail?id=' + applicatioId
	})
}

const getList = async () => {
	const result = await getListByLogin({
		pageNum: page.value,
		pageSize: pageSize.value
	})
	total.value = result.total
	data.value = result.rows
}

onMounted( async ()=> {
	console.log('onMounted')
	getList()
})

onShow(()=>{
	console.log('onShow')
	getList()
})

// const total = ref<number>(dataList.value.length)

const handleChange = ({value}) => {
	console.log('value', value)
	page.value = value
	getList()
}
</script>

<style scoped lang="scss"></style>
