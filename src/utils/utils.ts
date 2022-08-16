import md5 from 'md5';
import {productIdList, Env, ClassType} from './config';

export function getUid(userName: string) {
  const sign = md5(userName).slice(-6);
  return parseInt(sign, 16);
}

export function getPid(classType: ClassType, env: Env, lowDelayStatus: string) {
  if (lowDelayStatus && classType === 5) {
    return productIdList[env]['low'];
  } else {
    return productIdList[env][classType];
  }
}
