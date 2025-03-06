import { defineStore } from "pinia"
import { to } from 'await-to-js';
import { ref } from "vue"
import { loginByWechatApi, login as loginApi } from "@/api/login"
import { LoginData } from "@/pages/login/types"
const initState = {}

export const useUserStore = defineStore(
  "user",
  () => {
	const token = ref('');
    const userInfo = ref<IUserInfo>({ ...initState })
    const appid = "XXXXX" // 你的appid
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }
    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    /**
     * 微信登录
     */
    const loginByWechat = (phoneCode: string) => {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: "weixin",
          success: async (res) => {
            const loginRes = await loginByWechatApi({
              appid,
              loginCode: res.code,
              telephoneCode: phoneCode,
            })
            if (loginRes.success) {
              resolve(loginRes)
            } else {
              reject(loginRes)
            }
          },
          error: (error) => {
            reject(error)
          },
        })
      })
    }
	
	/**
	* 登录
	* @param userInfo
	* @returns
	*/
	const login = async (userInfo: LoginData): Promise<void> => {
		const [err, res] = await to(loginApi(userInfo));
		if (res) {
		  const data = res.data;
		  console.log(data)
		  // setToken(data.access_token);
		  token.value = data.access_token;
		  return Promise.resolve();
		}
		return Promise.reject(err);
	};
	
    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
      appid,
      loginByWechat,
	  login
    }
  },
  {
    persist: true,
  },
)
