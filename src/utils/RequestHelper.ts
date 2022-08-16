//引用
import { POST, GET, PUT, DEL } from "./Fetch";

// 登录
export function requestGetToken(params: any) {
  return POST('https://roomkit-api.zego.im/auth/get_sdk_token', {
    data: {
      ...params
    }
  })
}
