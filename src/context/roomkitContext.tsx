import React, { useContext, createContext, useReducer } from 'react';
import { useEffect } from 'react';
import { Env } from '../config';
import { getToken, storage } from '../utils/utils';

export interface RoomSettings {
  isMicrophoneOnWhenJoiningRoom: boolean;
  isCameraOnWhenJoiningRoom: boolean;
  beautifyMode: boolean;
  previewVideoMirrorMode: boolean;
  videoFitMode: boolean;
}
export interface RoomUIConfig {
  enableHandwriting: boolean;
  isFixedInOutMessage: boolean;
  isMemberLeaveRoomMessageHidden: boolean;
  // CustomUi
  isBottomBarHiddenMode: boolean;
  isChatHidden: boolean;
  isAttendeesHidden: boolean;
  isShareHidden: boolean;
  isCameraHidden: boolean;
  isMicrophoneHidden: boolean;
  isMoreHidden: boolean;
}
export interface RoomkitAction {
  // 数据初始化
  init: () => void;
  // set env
  setEnv: (env: Env) => void;
  updateToken: (deviceID: string) => Promise<any>;
  // RoomSettings
  setIsMicrophoneOnWhenJoiningRoom: (val: boolean) => void;
  setIsCameraOnWhenJoiningRoom: (val: boolean) => void;
  setBeautifyMode: (val: boolean) => void;
  setPreviewVideoMirrorMode: (val: boolean) => void;
  setVideoFitMode: (val: boolean) => void;
  // RoomUIConfig
  setEnableHandwriting: (val: boolean) => void;
  SetIsFixedInOutMessage: (val: boolean) => void;
  setIsMemberLeaveRoomMessageHidden: (val: boolean) => void;
  setIsBottomBarHiddenMode: (val: boolean) => void;
  setIsChatHidden: (val: boolean) => void;
  setIsAttendeesHidden: (val: boolean) => void;
  setIsShareHidden: (val: boolean) => void;
  setIsCameraHidden: (val: boolean) => void;
  setIsMicrophoneHidden: (val: boolean) => void;
  setIsMoreHidden: (val: boolean) => void;

  // avatar
  setIsAvatarHidden: (val: boolean) => void;
}
export interface RoomkitInitState {
  count: number;
  env: Env;
  token: string;
  roomSettings: RoomSettings;
  roomUIConfig: RoomUIConfig;
  isAvatarHidden: boolean;
}

const initialState: RoomkitInitState = {
  count: 0,
  env: Env.MainLand,
  token: '',
  roomSettings: {
    isMicrophoneOnWhenJoiningRoom: false,
    isCameraOnWhenJoiningRoom: false,
    beautifyMode: false,
    previewVideoMirrorMode: false,
    videoFitMode: false,
  },
  roomUIConfig: {
    enableHandwriting: false,
    isFixedInOutMessage: false,
    isMemberLeaveRoomMessageHidden: false,
    // CustomUI
    isBottomBarHiddenMode: false,
    isChatHidden: false,
    isAttendeesHidden: false,
    isShareHidden: false,
    isCameraHidden: false,
    isMicrophoneHidden: false,
    isMoreHidden: false,
  },
  isAvatarHidden: false
};

function roomkitReducer(state: RoomkitInitState, action: { type: any; payload?: any }) {
  let _state = JSON.parse(JSON.stringify(state));

  if (action.type === 'init') {
    const { stateWithStorage } = action.payload;
    _state = stateWithStorage;
  } else if (action.type === 'updateEnv') {
    const { env } = action.payload;
    _state.env = env;
  } else if (action.type === 'updateRoomSettings') {
    const { key, val } = action.payload;
    // @ts-ignore
    _state.roomSettings[key] = val;
    storage.setItem('roomSettings', JSON.stringify(_state.roomSettings));
  } else if (action.type === 'updateRoomUIConfig') {
    const { key, val } = action.payload;
    // @ts-ignore
    _state.roomUIConfig[key] = val;
    storage.setItem('roomUIConfig', JSON.stringify(_state.roomUIConfig));
  } else if (action.type === 'updateToken') {
    const { token } = action.payload;
    _state.token = token;
  } else if(action.type === "setIsAvatarHidden"){
    const { key, val } = action.payload;
    console.log('mytag key, val', key, val)
    _state.isAvatarHidden = val;

  }

  return _state;
}

// 封装 dispatch
const RoomkitHooks = () => {
  const [state, dispatch] = useReducer(roomkitReducer, initialState);

  const init = async () => {
    let _state = JSON.parse(JSON.stringify(initialState));
    const rawRoomSettings = await storage.getItem('roomSettings');
    if (rawRoomSettings) Object.assign(_state.roomSettings, JSON.parse(rawRoomSettings));

    const rawRoomUIConfig = await storage.getItem('roomUIConfig');
    if (rawRoomUIConfig) Object.assign(_state.roomUIConfig, JSON.parse(rawRoomUIConfig));

    console.log('mytag rawRoomUIConfig', rawRoomUIConfig);
    dispatch({ type: 'init', payload: { stateWithStorage: _state } });
  };
  const setEnv = (env: Env) => {
    console.log('mytag env', env);
    dispatch({ type: 'updateEnv', payload: { env } });
  };
  const updateToken = async (deviceID: string) => {
    console.log('mytag updateToken deviceID', deviceID)
    const token = await getToken(deviceID);
    console.log('mytag updateToken token', token)
    dispatch({ type: 'updateToken', payload: { token } });
    return token;
  };
  // roomSettings
  const setIsMicrophoneOnWhenJoiningRoom = (val: boolean) => {
    dispatch({ type: 'updateRoomSettings', payload: { key: 'isMicrophoneOnWhenJoiningRoom', val } });
  };
  const setIsCameraOnWhenJoiningRoom = (val: boolean) => {
    dispatch({ type: 'updateRoomSettings', payload: { key: 'isCameraOnWhenJoiningRoom', val } });
  };
  const setBeautifyMode = (val: boolean) => {
    dispatch({ type: 'updateRoomSettings', payload: { key: 'beautifyMode', val } });
  };
  const setPreviewVideoMirrorMode = (val: boolean) => {
    dispatch({ type: 'updateRoomSettings', payload: { key: 'previewVideoMirrorMode', val } });
  };
  const setVideoFitMode = (val: boolean) => {
    dispatch({ type: 'updateRoomSettings', payload: { key: 'videoFitMode', val } });
  };

  // roomUIConfig
  const setIsMemberLeaveRoomMessageHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isMemberLeaveRoomMessageHidden', val } });
  };
  const setEnableHandwriting = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'enableHandwriting', val } });
  };
  const SetIsFixedInOutMessage = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isFixedInOutMessage', val } });
  };
  // CustomUi page
  const setIsBottomBarHiddenMode = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isBottomBarHiddenMode', val } });
  };
  const setIsChatHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isChatHidden', val } });
  };
  const setIsAttendeesHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isAttendeesHidden', val } });
  };
  const setIsShareHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isShareHidden', val } });
  };
  const setIsCameraHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isCameraHidden', val } });
  };
  const setIsMicrophoneHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isMicrophoneHidden', val } });
  };
  const setIsMoreHidden = (val: boolean) => {
    dispatch({ type: 'updateRoomUIConfig', payload: { key: 'isMoreHidden', val } });
  };
  const setIsAvatarHidden = (val: boolean) => {
    dispatch({ type: 'setIsAvatarHidden', payload: { key: 'isAvatarHidden', val } });
  };

  return {
    state,
    init,
    setEnv,
    updateToken,
    setIsMicrophoneOnWhenJoiningRoom,
    setIsCameraOnWhenJoiningRoom,
    setBeautifyMode,
    setPreviewVideoMirrorMode,
    setVideoFitMode,
    setEnableHandwriting,
    SetIsFixedInOutMessage,
    setIsMemberLeaveRoomMessageHidden,
    setIsBottomBarHiddenMode,
    setIsChatHidden,
    setIsAttendeesHidden,
    setIsShareHidden,
    setIsCameraHidden,
    setIsMicrophoneHidden,
    setIsMoreHidden,
    setIsAvatarHidden
  };
};

// 创建 上下文
const RoomKitContext = createContext({});

export const useRoomkit = () => {
  // @ts-ignore
  const { state, ...action } = useContext(RoomKitContext);
  return [state, action] as [RoomkitInitState, RoomkitAction];
};

export const RoomkitProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // 下发状态，然后在子组件中通过自定义 hook 获取context
  const roomkitHooks = RoomkitHooks();
  console.log('mytag re-render ============');
  useEffect(() => {
    // 初始化，从storage 获取之前的设置。
    roomkitHooks.init();
  }, []);
  return <RoomKitContext.Provider value={roomkitHooks}>{children}</RoomKitContext.Provider>;
};
