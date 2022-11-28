import { Env, ClassType } from "./types/types";  // 类型
// roomkit 服务端请求域名
export const RoomkitServiceDomain = 'https://roomkit-api.zego.im';
// 教育云服务端域名
export const EduServiceDomain = 'https://roomkit-edu-api.zego.im';

// 在 RoomKit 管理后台中获取到 SecretID、SecretSign。
export const SecretID = 0;
export const SecretSign = '';

// ProductID 与下面的 productIdList 二选一进行填写即可。
// 当填写了 ProductID ，则 App 内所有的课堂类型和环境选择都会使用该 ProductID 。
export const ProductID = 0

// 当 ProductID 为空时，并填写了 productIdList 后，APP 内选择对应的课堂类型或者环境，则会选择对应的 ProductID。
// MainLand：中国大陆
// OverSeas：海外
// Class_1V1：1V1课
// CLASS_SMALL：小班课
// CLASS_LARGE：大班课
export const productIdList = {
  [Env.MainLand]: {
    [ClassType.Class_1V1]: 0,
    [ClassType.CLASS_SMALL]: 0,
    [ClassType.CLASS_LARGE]: 0,
  },
  [Env.OverSeas]: {
    [ClassType.Class_1V1]: 0,
    [ClassType.CLASS_SMALL]: 0,
    [ClassType.CLASS_LARGE]: 0,
  },
};
