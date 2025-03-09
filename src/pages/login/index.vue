<template>
	<view class="login-container">
		<view class="login-header">
			<image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
			<text class="title">车辆出入审批系统</text>
		</view>

		<view class="login-form">
			<view class="input-group">
				<uni-icons type="person" size="20"></uni-icons>
				<input type="text" v-model="loginForm.username" placeholder="请输入用户名/手机号" class="input-field" />
			</view>

			<view class="input-group">
				<uni-icons type="locked" size="20"></uni-icons>
				<input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="请输入密码"
					class="input-field" />
				<uni-icons :type="showPassword ? 'eye-filled' : 'eye-slash-filled'" size="20"
					@click="togglePassword"></uni-icons>
			</view>

			<button class="login-btn" @click="handleLogin">登录</button>

		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { to } from 'await-to-js';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const loginForm = ref({
	tenantId: '000000',
	username: '',
	password: '',
	rememberMe: false,
	code: '',
	uuid: ''
});

const showPassword = ref(false);

const togglePassword = () => {
	showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
	if (!loginForm.value.username || !loginForm.value.password) {
		uni.showToast({
			title: '请填写完整登录信息',
			icon: 'none'
		});
		return;
	}

	const [err] = await to(userStore.login(loginForm.value));
	if (!err) {
		uni.showToast({
			title: '登录成功',
			icon: 'none'
		});
		uni.switchTab({
		    url: '/pages/home/index'
		});
		
		
	} else {
		uni.showToast({
			title: err.message,
			icon: 'none'
		});
	}
};
</script>

<style lang="scss" scoped>
	.login-container {
		min-height: 100vh;
		padding: 40rpx;
		background-color: #f5f5f5;

		.login-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 60rpx 0;

			.logo {
				width: 160rpx;
				height: 160rpx;
				margin-bottom: 20rpx;
			}

			.title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.login-form {
			background-color: #fff;
			border-radius: 20rpx;
			padding: 40rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.input-group {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #eee;
				padding: 20rpx 0;
				margin-bottom: 30rpx;

				.input-field {
					flex: 1;
					margin-left: 20rpx;
					font-size: 28rpx;
				}
			}

			.login-btn {
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #007AFF;
				color: #fff;
				border-radius: 44rpx;
				font-size: 32rpx;
				margin-top: 60rpx;
				border: none;

				&:active {
					opacity: 0.8;
				}
			}

			.login-options {
				display: flex;
				justify-content: flex-end;
				margin-top: 20rpx;

				text {
					color: #007AFF;
					font-size: 26rpx;
				}
			}
		}
	}
</style>