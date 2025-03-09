<template>
  <view class="home-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-avatar-wrap">
        <image
          class="avatar-image"
          :src="userStore.avatar || '/static/images/profile.jpg'"
          mode="aspectFill"
        />
      </view>
      <view class="user-details">
        <view class="user-name">
          {{ userStore.nickname || "微信用户" }}
        </view>
        <view class="user-type">
          {{ userStore.userType === "tourist" ? "个人用户" : "法人代表" }}
        </view>
      </view>
    </view>

    <!-- 橙色提示条 -->
    <!--   <view class="notice-bar">
      <image class="notice-icon" src="/static/images/profile.jpg" mode="aspectFit"></image>
      <text class="notice-text">您的申请已提交</text>
    </view> -->

    <!-- 功能图标区域 -->
    <view class="feature-grid">
      <view class="feature-item" @click="toAddApplication">
        <view class="feature-icon health-file">
          <wd-icon name="document" size="24" color="#4080FF"></wd-icon>
        </view>
        <text class="feature-text">新增申请</text>
      </view>
      <view class="feature-item" @click="switchToMyApplication">
        <view class="feature-icon health-file">
          <wd-icon name="document" size="24" color="#4080FF"></wd-icon>
        </view>
        <text class="feature-text">我的申请</text>
      </view>
      <view class="feature-item">
        <view class="feature-icon medicine">
          <wd-icon name="medical-kit" size="24" color="#4080FF"></wd-icon>
        </view>
        <text class="feature-text">我的信息</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="function-item" @click="handleFeedback">
        <view class="function-icon">
          <wd-icon name="comment" size="20"></wd-icon>
        </view>
        <text class="function-title">功能反馈</text>
        <view class="function-arrow">></view>
      </view>
      <view class="function-item">
        <view class="function-icon">
          <wd-icon name="question" size="20"></wd-icon>
        </view>
        <text class="function-title">常见问题</text>
        <view class="function-arrow">></view>
      </view>
      <view class="function-item">
        <view class="function-icon">
          <wd-icon name="info" size="20"></wd-icon>
        </view>
        <text class="function-title">关于我们</text>
        <view class="function-arrow">></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user"
import { onMounted } from "vue"

const userStore = useUserStore()

const toOrderDetail = () => {
  uni.navigateTo({
    url: "/pages-sub/orderDetail/index",
  })
}

const toAddApplication = () => {
  uni.navigateTo({
    url: "/pages-sub/application/index",
  })
}

const switchToMyApplication = () => {
  uni.switchTab({
    url: "/pages/index/index",
  })
}

const handleFeedback = () => {
  uni.showToast({
    title: "感谢您的反馈",
    icon: "none",
  })
}

const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现退出登录逻辑
        uni.reLaunch({
          url: "/pages/login/index",
        })
      }
    },
  })
}

onMounted(async () => {
  const data = await userStore.getInfo()
  console.log("user", data)
})
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 0; /* 移除底部间距，因为已经有tabbar了 */
  padding-top: 0; /* 移除顶部间距 */
  position: relative;
  overflow-y: hidden; /* 防止出现滚动条 */

  .user-info-section {
    background-image: linear-gradient(135deg, #4080ff, #6e9fff);
    padding: 60rpx 40rpx 30rpx;
    display: flex;
    align-items: center;
    border-bottom: none;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

    &::before {
      content: "";
      position: absolute;
      top: -100rpx;
      right: -100rpx;
      width: 300rpx;
      height: 300rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: -80rpx;
      left: -80rpx;
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      z-index: 1;
    }

    .user-avatar-wrap {
      margin-right: 30rpx;
      position: relative;
      z-index: 2;

      .avatar-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: #f0f0f0;
        border: 3rpx solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
      }
    }

    .user-details {
      flex: 1;
      position: relative;
      z-index: 2;

      .user-name {
        font-size: 34rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;

        .arrow-icon {
          color: rgba(255, 255, 255, 0.8);
          font-size: 28rpx;
        }
      }

      .user-type {
        display: inline-block;
        font-size: 24rpx;
        color: #4080ff;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
      }
    }
  }

  .notice-bar {
    background-color: #fff7e6;
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    margin: 20rpx;
    border-radius: 16rpx;

    .notice-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;
      border-radius: 50%;
    }

    .notice-text {
      flex: 1;
      font-size: 26rpx;
      color: #ff9500;
    }

    .notice-btn {
      background-color: #ffffff;
      color: #ff9500;
      font-size: 24rpx;
      padding: 8rpx 20rpx;
      border-radius: 30rpx;
      border: 1px solid #ff9500;
    }
  }

  .feature-grid {
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
    padding: 30rpx 20rpx;
    margin: 20rpx;
    border-radius: 16rpx;

    .feature-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20rpx;

      .feature-icon {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        background-color: #ebf3ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
      }

      .feature-text {
        font-size: 26rpx;
        color: #333;
      }
    }
  }

  .function-list {
    background-color: #ffffff;
    margin: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;

    .function-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .function-icon {
        margin-right: 20rpx;
        color: #666;
      }

      .function-title {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .function-arrow {
        color: #999;
        font-size: 28rpx;
      }
    }
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 110rpx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid #f0f0f0;
    z-index: 100;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 33.33%;
      color: #999;

      &.active {
        color: #4080ff;
      }

      .nav-text {
        font-size: 24rpx;
        margin-top: 6rpx;
      }
    }

    .record-btn {
      margin-top: -40rpx;

      .record-circle {
        width: 120rpx;
        height: 120rpx;
        background-color: #4080ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4rpx 10rpx rgba(64, 128, 255, 0.3);

        .record-text {
          color: #ffffff;
          font-size: 26rpx;
          text-align: center;
          line-height: 1.3;
        }
      }
    }
  }
}
</style>
