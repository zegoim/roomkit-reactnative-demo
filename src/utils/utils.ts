import AsyncStorage from '@react-native-async-storage/async-storage'
import md5 from 'md5';
import { productIdList, Env, ClassType, SecretID, SecretSign } from '../config';
import { getSdkTokenApi, getRoomInfoApi } from '../api/requestApi';
// @ts-ignore
import { getRoomkitToken } from "@hailanglang/zego-token-generator"

export function getUid(userName: string) {
  const sign = md5(userName).slice(-6);
  return parseInt(sign, 16);
}

export function getPid(classType: ClassType, env: Env,): Number {
  return productIdList[env][classType];
}

export const getToken = async (deviceid: string) => {
  
  // get token by zego-token-generator
  // const token = await getRoomkitToken({ deviceID: deviceid, secretID: SecretID, secretSign: SecretSign })
  // console.log('mytag token getRoomkitToken', token)
  // return token

  // get token by md5 and axios 
  let time = Math.floor(new Date().getTime() / 1000) + 3600;
  let sign = SecretSign;
  const verifyType = 3;
  const version = 1;

  const signStr = `${sign.substr(0, 32)}${deviceid}${verifyType}${version}${time}`;
  let params = {
    sign: md5(signStr),
    secret_id: SecretID,
    device_id: deviceid,
    timestamp: time,
    common_data: {
      platform: 0,
    },
  };
  let res = await getSdkTokenApi(params);
  return res.data.sdk_token;
};

export const storage = {
  async setItem(key: string, val: string) {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.log('setItem error', error);
    }
  },
  async getItem(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log('getItem error', error);
      return null;
    }
  },
  getAsyncStorage() {
    return AsyncStorage
  }
};

