import { CustomRequestOptions } from "@/interceptors/request"
import { encryptBase64, encryptWithAes, generateAesKey, decryptWithAes, decryptBase64 } from '@/utils/crypto';
import { encrypt } from '@/utils/encrypt'
import { useUserStore } from "@/store"
import { getToken } from '@/utils/auth';

// 可以根据不同环境配置不同的baseUrl
const PREFIX = "/dev-api";
// const encryptHeader = 'encrypt-key';

// 处理url，拼接baseUrl
const getFullUrl = (url: string): string => {
  // 如果url已经是完整的http或https开头的地址，则直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 确保url和PREFIX之间只有一个斜杠
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  return `${PREFIX}/${url}`;
}

export const request = async <T>(options: CustomRequestOptions): Promise<ApiResult<T>> => {
  const userStore = useUserStore()

  const handleAuthFailure = () => {
    userStore.clearUserInfo()
    uni.removeStorageSync("userInfo")
    uni.navigateTo({ url: "/pages/login/index" })
  }

  try {
    // 处理url，拼接baseUrl
    // options.url = getFullUrl(options.url);
	console.log('token', getToken())
	 const isToken = options.header?.isToken === false;
	
	if (getToken() && !isToken) {
	      options.header = {
			  'Authorization': 'Bearer ' + getToken()
		  }
	}
	
	if(options.encrypt) {
		
		// 生成一个 AES 密钥
		const aesKey = generateAesKey();
		options.header = {
			'encrypt-key': encrypt(encryptBase64(aesKey))
		}
		options.data = typeof options.data === 'object' ? encryptWithAes(JSON.stringify(options.data), aesKey) : encryptWithAes(options.data, aesKey);
	}
    
    const res = await uni.request({
      ...options,
      dataType: "json",
      // #ifndef MP-WEIXIN
      responseType: "json",
      // #endif
    })

    const { statusCode, data } = res
    const result = data as ApiResult<T>
	console.log('result111', result)
    if (statusCode >= 200 && statusCode < 300) {
		
      if (result.code === 200) {
        return result
      } else {
        uni.showToast({
          icon: "none",
          title: result.msg || "请求错误",
          duration: 5000,
        })

        const authFailureCodes = ["202", "203", "xxx"]
        if (authFailureCodes.includes(result.code)) {
          handleAuthFailure()
          setTimeout(() => {
            uni.navigateTo({ url: "/pages/login/index" })
          }, 2000)
        }
        throw result
      }
    } else if (statusCode === 401) {
      handleAuthFailure()
      throw res
    } else {
      if (!options.hideErrorToast) {
        uni.showToast({
          icon: "none",
          title: result.msg || "请求错误",
          duration: 5000,
        })
      }
      throw res
    }
  } catch (err) {
    console.error("请求失败:", err)
    uni.showToast({
      icon: "none",
      title: "请求失败，请稍后再试",
      duration: 5000,
    })
  }
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 */
export const requestGet = <T>(url: string, query?: Record<string, any>) => {
  return request<T>({
	url,
    query,
    method: "GET",
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数
 */
export const requestPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return request<T>({
    url,
    query,
    data,
    method: "POST",
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数
 */
export const requestPostEncrypt = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return request<T>({
    url,
    query,
    data,
    method: "POST",
	encrypt: true
  })
}

request.get = requestGet
request.post = requestPost
request.postEncrypt = requestPostEncrypt
