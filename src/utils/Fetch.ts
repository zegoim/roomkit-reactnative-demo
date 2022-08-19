/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-11 09:47:54
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-11 11:30:25
 * @FilePath: /grett/zego_roomkit_reactnative_sdk/example/src/utils/Fetch.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import _ from 'lodash';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {RoomkitServiceDomain, EduServiceDomain} from './config';
import Toast from 'react-native-toast-message';
// import config from "./config";

// const Toast = {
//   fail(msg: string) {
//     console.error('msg', msg);
//   },
//   info(msg: string) {
//     console.log('mytag msg', msg);
//   },
// };
interface ajaxOptions {
  baseURL?: string;
  version?: string;
  headers?: object;
  method?: string;
  data?: object;
  isEduService?: boolean;
}

enum SERVICE_TYPE {
  EUD_SERVICE = 0,
  ROOMKIT_SERVICE = 1,
}

export const ajax = (url: string, options: ajaxOptions) => {
  let axiosOptions: AxiosRequestConfig = {};

  axiosOptions = {
    headers: {...options.headers},
    method: options.method || 'get',
    timeout: 30 * 1000,
    baseURL: !!options.isEduService ? EduServiceDomain : RoomkitServiceDomain,
  };

  if (options.data && (options.method === 'get' || options.method === 'delete')) {
    axiosOptions.params = options.data;
  } else {
    axiosOptions.data = options.data;
  }

  return new Promise<any>((resolve: any, reject: any) => {
    axios(url, axiosOptions)
      .then(async (res: AxiosResponse<any>) => {
        console.log('mytag res.data', res.data);
        if (res.data.ret.code === 0) {
          return resolve(res.data);
        }
        // Toast.fail(res.data.ret);
        Toast.show({text1: `message:${res.data.ret.message}`, type: 'error'});
        reject({
          ...res,
          handled: false,
        });
      })
      .catch(async (err: AxiosError) => {
        console.log('mytag err', err);
        // console.warn("err",err);
        // console.log("url, axiosOptions",url, axiosOptions);
        if (!err.response) {
          Toast.show({text1: '服务繁忙，稍候请重试', type: 'error'});
          reject({...err, handled: true});
          return;
        }

        if (err.response.status == 401) {
          reject({handled: true});
          // Toast.info('登录状态失效，请重新登录');
          Toast.show({text1: '登录状态失效，请重新登录', type: 'error'});
        } else if (err.response.status == 400) {
          reject({
            data: err.response.data,
            // @ts-ignore
            message: err.response.data?.msg,
            handled: false,
          });
        } else {
          reject({...err, handled: true});
          Toast.show({text1: '服务繁忙，稍候请重试', type: 'error'});
        }
        reject({...err, handled: true});
      });
  });
};

// export const GET = (url: string, options: ajaxOptions) =>
//   ajax(url, {
//     ...options,
//     method: 'get',
//   });
// export const PUT = (url: string, options: ajaxOptions) =>
//   ajax(url, {
//     ...options,
//     method: 'put',
//   });
export const POST = (url: string, options: ajaxOptions) => ajax(url, {...options, method: 'post'});
// export const DEL = (url: string, options: ajaxOptions) =>
//   ajax(url, {
//     ...options,
//     method: 'delete',
//   });

// 登录
export function getSdkToken(params: any) {
  return POST('/auth/get_sdk_token', {data: {...params}, isEduService: false});
}

// 获取房间信息，教育云接口
export function getRoomInfo(params: any) {
  return POST('/room/get', {data: {...params}, isEduService: true});
}

export function createClassRoom(params: any) {
  return POST('/room/create', {data: {...params}, isEduService: true});
}

export function getClassRoomList(params: any) {
  return POST('/room/query', {data: {...params}, isEduService: true});
}
export function deleteClass(params: any) {
  return POST('/room/cancel', {data: {...params}, isEduService: true});
}
