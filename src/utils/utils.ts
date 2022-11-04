import AsyncStorage from '@react-native-async-storage/async-storage'
import md5 from 'md5';
import { productIdList, Env, ClassType } from '../config';
import { getSdkTokenApi, getRoomInfoApi } from '../api/requestApi';

export function getUid(userName: string) {
  const sign = md5(userName).slice(-6);
  return parseInt(sign, 16);
}

export function getPid(classType: ClassType, env: Env, lowDelayStatus: boolean): Number {
  if (lowDelayStatus && classType === 5) {
    return productIdList[env]['low'];
  } else {
    return productIdList[env][classType];
  }
}

export const getToken = async (deviceid: string) => {
  let time = Math.floor(new Date().getTime() / 1000) + 3600;
  let sign = 'a37c7361f6af711920a5698edf6d1d148bba1dd7d8e995442133ea9be1123e46';
  const verifyType = 3;
  const version = 1;

  const signStr = `${sign.substr(0, 32)}${deviceid}${verifyType}${version}${time}`;
  let params = {
    sign: md5(signStr),
    secret_id: 1000001,
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

