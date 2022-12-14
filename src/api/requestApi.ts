
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {RoomkitServiceDomain, EduServiceDomain} from '../config';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';

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
    timeout: 8 * 1000,
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
        console.log('response', res.data);
        if (res.data.ret.code === 0) {
          return resolve(res.data);
        }
        // Toast.fail(res.data.ret);
        if(res.data.ret.code !== 20001){
          Toast.show({text1: `message:${res.data.ret.message}`, type: 'error'});
        }
        reject({
          res,
          handled: false,
        });
      })
      .catch(async (err: AxiosError) => {
        console.log('err', err);

        if (!err.response) {
          Toast.show({text1: i18n.t('server_busy'), type: 'error'});
          reject({...err, handled: true});
          return;
        }

        if (err.response.status == 401) {
          reject({handled: true});
          // Toast.info('登录状态失效，请重新登录');
          Toast.show({text1: i18n.t('log_in_again'), type: 'error'});
        } else if (err.response.status == 400) {
          reject({
            data: err.response.data,
            // @ts-ignore
            message: err.response.data?.msg,
            handled: false,
          });
        } else {
          reject({...err, handled: true});
          Toast.show({text1: i18n.t('server_busy'), type: 'error'});
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
export function getSdkTokenApi(params: any) {
  return POST('/auth/get_sdk_token', {data: {...params}, isEduService: false});
}

// 获取房间信息，教育云接口
export function getRoomInfoApi(params: any) {
  return POST('/room/get', {data: {...params}, isEduService: true});
}

export function createClassRoomApi(params: any) {
  return POST('/room/create', {data: {...params}, isEduService: true});
}

export function getClassRoomListApi(params: any) {
  return POST('/room/query', {data: {...params}, isEduService: true});
}
export function deleteClassApi(params: any) {
  return POST('/room/cancel', {data: {...params}, isEduService: true});
}
