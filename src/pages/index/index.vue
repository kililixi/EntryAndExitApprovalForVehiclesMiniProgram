<template>
  <view>
    <view v-for="(layout, index) in body.bodyList" :key="index">
      <up-swiper
        :list="swiperList"
        indicator
        indicatorMode="dot"
        v-if="layout.type === 'banner'"
      ></up-swiper>
		<wd-text
		  text="芦叶满汀洲，寒沙带浅流。二十年重过南楼。柳下系船犹未稳，能几日，又中秋。黄鹤断矶头，故人曾到否？旧江山浑是新愁。欲买桂花同载酒，终不似，少年游。"
		></wd-text>
		<wd-text type="primary" text="主色"></wd-text>
		<wd-text type="error" text="错误"></wd-text>
		<wd-text type="success" text="成功"></wd-text>
		<wd-text type="warning" text="警告"></wd-text>
		<wd-text text="默认"></wd-text>
      <view class="mt-4" v-if="layout.type === 'card'">{{ layout.title }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import pageConfig from "@/config/style.config"
const { body } = pageConfig.layoutEnum?.indexPage || {}
const swiperList = reactive([
  "https://cdn.uviewui.com/uview/swiper/swiper1.png",
  "https://cdn.uviewui.com/uview/swiper/swiper2.png",
  "https://cdn.uviewui.com/uview/swiper/swiper3.png",
])
const scrollList = reactive([
  {
    thumb: "https://cdn.uviewui.com/uview/goods/1.jpg",
  },
  {
    thumb: "https://cdn.uviewui.com/uview/goods/2.jpg",
  },
  {
    thumb: "https://cdn.uviewui.com/uview/goods/3.jpg",
  },
  {
    thumb: "https://cdn.uviewui.com/uview/goods/4.jpg",
  },
  {
    thumb: "https://cdn.uviewui.com/uview/goods/5.jpg",
  },
])
</script>

<style lang="scss" scoped></style>
