// roomkit 服务端接口
export const RoomkitServiceDomain = 'https://roomkit-api.zego.im';
// 教育云服务端接口
export const EduServiceDomain ='https://roomkit-edu-api.zego.im';

export enum Env {
  MainLand = 1,
  OverSeas = 2,
}
export enum ClassType {
  Class_1V1 = 3,
  CLASS_SMALL = 1,
  CLASS_LARGE = 5,
}

// 以下信息请使用控制台进行获取
export const SecretID = 0;
export const SecretSign = '';

// 根据在控制台获取的 pid 类型，填写到对应的课堂类型，默认的环境值为 MainLand。
// 默认的环境值可以在 context/roomkitContext.tsx 中 initialState 变量进行的修改。
export const productIdList = {
  [Env.MainLand]: {
    [ClassType.Class_1V1]: 0,    // 1v1
    [ClassType.CLASS_SMALL]: 0,  // 小班课
    [ClassType.CLASS_LARGE]: 0,  // 大班课
  },
  [Env.OverSeas]: {
    [ClassType.Class_1V1]: 0,
    [ClassType.CLASS_SMALL]: 0,
    [ClassType.CLASS_LARGE]: 0,
  },
};
