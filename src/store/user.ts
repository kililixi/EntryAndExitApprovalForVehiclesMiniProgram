import { defineStore } from "pinia"
import { to } from 'await-to-js';
import { ref } from "vue"
import { loginByWechatApi, login as loginApi, getInfo as getUserInfo } from "@/api/login"
import { LoginData } from "@/pages/login/types"
const initState = {}
// import defAva from '@/assets/images/profile.jpg';
// const defAva = import.meta.glob(`../../assets/image/workbench/*.png`, { eager: true })
import { getToken, removeToken, setToken } from '@/utils/auth';

export const useUserStore = defineStore(
  "user",
  () => {
	const token = ref('');
    const userInfo = ref<IUserInfo>({ ...initState })
    const appid = "XXXXX" // 你的appid
	
	const name = ref('');
  const nickname = ref('');
  const unitId = ref<string | number>('');
  const deptId = ref<string | number>('');
  const userId = ref<string | number>('');
  const unitName = ref<string>('');
  const deptName = ref<string>('');
  const userType = ref<string>('tourist');
  const avatar = ref('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  
	
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
            if (loginRes.code === 200) {
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
		console.log('err', err, res)
		if (res) {
		  const data = res.data;
		  console.log(data)
		  setToken(data.access_token);
		  token.value = data.access_token;
		  
		  return Promise.resolve();
		}
		return Promise.reject(err);
	};
	
	// 获取用户信息
	const getInfo = async (): Promise<void> => {
	    const [err, res] = await to(getUserInfo());
	    if (res) {
	      const data = res.data;
	      const user = data.user;
	      const profile = user.avatar === '' || user.avatar === null ? '' : user.avatar;
	
	      if (data.roles && data.roles.length > 0) {
	        // 验证返回的roles是否是一个非空数组
	        roles.value = data.roles;
	        permissions.value = data.permissions;
	      } else {
	        roles.value = ['ROLE_DEFAULT'];
	      }
	      name.value = user.userName;
	      nickname.value = user.nickName;
	      avatar.value = profile;
	      userId.value = user.userId;
	      unitId.value = user.unitId;
	      deptId.value = user.deptId;
	      unitName.value = user.unitName
	      deptName.value = user.deptName;
		  userType.value = user.userType
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
	  login,
	  getInfo,
      // 返回用户基本信息，供页面使用
      name,
      nickname,
      avatar,
      userId,
      unitId,
      deptId,
      unitName,
      deptName,
      roles,
      permissions,
	  userType
    }
  },
  {
    persist: true,
  },
)
