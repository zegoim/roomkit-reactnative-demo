/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-11 09:47:54
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-11 11:30:25
 * @FilePath: /grett/zego_roomkit_reactnative_sdk/example/src/utils/Fetch.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import _ from 'lodash'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import {Toast} from "antd-mobile-rn"
import config from "./config";

interface ajaxOptions {
  baseURL?: string
  version?: string
  headers?: object
  method?: string
  data?: object
}

export const ajax = (url: string, options: ajaxOptions) => {
  let axiosOptions: AxiosRequestConfig = {}

  axiosOptions.headers = {
    ...options.headers
  }
//请求方式
  axiosOptions.method = options.method || 'get'
//超时时间
  axiosOptions.timeout = 30 * 1000

  if (options.data && _.includes(['get', 'delete'], options.method))
    axiosOptions.params = options.data
  else
    axiosOptions.data = options.data

  return new Promise<any>((resolve:any, reject:any) => {
    axios(url, axiosOptions)
      .then(async (res: AxiosResponse<any>) => {
        if(res.data.ret.code === 0){
          resolve(res.data)
          return
          // @ts-ignore
        } 

        Toast.fail(res.data.ret)
        reject({
          ...res,
          handled:false
        })
      })
      .catch(async (err: AxiosError) => {
        console.warn(err)
        console.log(url,axiosOptions)
        if (!err.response) {
          Toast.fail('服务繁忙，稍候请重试')
          reject({ ...err, handled: true })
          return
        }

        if (err.response.status == 401) {
          reject({ handled: true })
          Toast.info('登录状态失效，请重新登录')
        }
        else if (err.response.status == 400) {
          reject({
            data: err.response.data,
            message: _.get(err.response.data, 'msg'),
            handled: false
          })
        }
        else {
          reject({ ...err, handled: true })
          Toast.fail('服务繁忙，稍候请重试')
        }
      })
  })
}

export const GET = (url: string, options: ajaxOptions) => ajax(url, {
  ...options,
  method: 'get'
})
export const PUT = (url: string, options: ajaxOptions) => ajax(url, {
  ...options,
  method: 'put'
})
export const POST = (url: string, options: ajaxOptions) => ajax(url, {
  ...options,
  method: 'post'
})
export const DEL = (url: string, options: ajaxOptions) => ajax(url, {
  ...options,
  method: 'delete'
})
