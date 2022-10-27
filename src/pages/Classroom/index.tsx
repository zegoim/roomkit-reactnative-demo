import React, { useCallback, useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import { getRoomInfoApi } from '../../api/requestApi';
import { getToken } from '../../utils/utils';
import ZegoRoomkitSdk, {
  ZegoRoomkitJoinRoomConfig,
  setRoomParameterConfig,
  ZegoBeautifyMode,
  ZegoPreviewVideoMirrorMode,
  ZegoVideoFitMode
} from 'zego_roomkit_reactnative_sdk';

import { SecretID } from '../../config';
import { useRoomkit } from '../../context/roomkitContext';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingContext } from '../../App';


const App: React.FC<{
  navigation: any;
  route: {
    params: {
      roomID: string;
      userName: string;
      role: number;
      classType: number;
      userID: string;
      pid: number;
    };
  };
}> = ({ navigation, route }) => {
  const [roomkitstate] = useRoomkit();
  // @ts-ignore
  const { setSpinner } = useContext(LoadingContext)

  useFocusEffect(
    useCallback(() => {
      console.log('mytag touch joinroom',)
      joinRoom();
      // Do something when the screen is focused
      // getClassList();
      return () => {
        console.log('mytag unfocues classRoom');
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  async function joinRoom() {
    try {
      // setSpinner(true)
      const { userID, roomID, pid, userName, role } = route.params;
      // 初始化

      // try {
      //   await ZegoRoomkitSdk.instance().getDeviceID();
      // } catch (error) {
      await ZegoRoomkitSdk.init({
        secretID: SecretID,
      });
      // }
      callbackRegister();

      const roomService = ZegoRoomkitSdk.instance().inRoomService();
      const roomSetting = ZegoRoomkitSdk.instance().roomSettings();

      // avator config
      if (!roomkitstate.isAvatarHidden) {
        await roomService.setUserParameter({
          avatarUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
          customIconUrl: 'https://gss3.bdstatic.com/84oSdTum2Q5BphGlnYG/timg?wapp&quality=80&size=b150_150&subsize=20480&cut_x=0&cut_w=0&cut_y=0&cut_h=0&sec=1369815402&srctrace&di=9f46b42f94ad866a87f516bccc32bbbc&wh_rate=null&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2Fb1f204d162d9f2d398ed608fa6ec8a136227ccdd.jpg',
        });
      }
      // UI config
      const { isBottomBarHiddenMode } = roomkitstate.roomUIConfig;
      await roomService.setUIConfig({
        ...roomkitstate.roomUIConfig,
        // @ts-ignore
        bottomBarHiddenMode: !isBottomBarHiddenMode ? 0 : 1,
      });
      // room button config
      const {
        isMicrophoneOnWhenJoiningRoom,
        isCameraOnWhenJoiningRoom,
        beautifyMode,
        previewVideoMirrorMode,
        videoFitMode,
      } = roomkitstate.roomSettings;
      await roomSetting.setIsMicrophoneOnWhenJoiningRoom(isMicrophoneOnWhenJoiningRoom)
      await roomSetting.setIsCameraOnWhenJoiningRoom(isCameraOnWhenJoiningRoom)
      await roomSetting.setBeautifyMode(beautifyMode ? ZegoBeautifyMode.ZegoBeautifyNone : ZegoBeautifyMode.ZegoBeautifyMedium)
      await roomSetting.setPreviewVideoMirrorMode(previewVideoMirrorMode ? ZegoPreviewVideoMirrorMode.ZegoPreviewVideoMirrorModeNone : ZegoPreviewVideoMirrorMode.ZegoPreviewVideoMirrorModeLeftRightSwap)
      await roomSetting.setVideoFitMode(videoFitMode ? ZegoVideoFitMode.ZegoVideoAspectFit : ZegoVideoFitMode.ZegoVideoFill)

      // ZegoRoomkitSdk.instance().setAdvancedConfig({
      //   domain: Domain,
      // });

      // setRoomParameter
      const classDetail = await getClassDetail();
      let roomParameter = {
        subject: classDetail && classDetail.subject,
        beginTimestamp: new Date().getTime(),
      } as setRoomParameterConfig;
      await roomService.setRoomParameter(roomParameter);

      // joinRoomWithConfig
      let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
      const token = await getToken(deviceID);
      let joinConfig = {
        userName,
        userID,
        roomID,
        productID: pid,
        role,
        token: token,
      } as unknown as ZegoRoomkitJoinRoomConfig;
      await roomService.joinRoomWithConfig(joinConfig);

      // setSpinner(false)
      console.log('mytag done');
    } catch (error) {
      // setSpinner(false)
      console.log('mytag error in joinRoom', error);
    }
  }
  function callbackRegister() {
    ZegoRoomkitSdk.instance().on('inRoomEventNotify', function (event, roomId) {
      console.log('mytag event', event)
      console.log('mytag roomId', roomId)
      // console.log('mytag event', event)
      // console.log('mytag roomId', roomId)
      // // @ts-ignore
      // if (event.event == 0) {
      //   ZegoRoomkitSdk.instance().unInit()
      //   navigation.goBack()
      // }
    });
    ZegoRoomkitSdk.instance().on('memberJoinRoom', (args) => {
      console.log('mytag memberJoinRoom', args);
    });
    ZegoRoomkitSdk.instance().on('memberLeaveRoom', () => {
      console.log('mytag touch memberLeaveRoom');
      // navigation.goBack();
    });

    ZegoRoomkitSdk.instance().on('buttonEvent', function () {
      console.log('mytag buttonEvent', arguments);
    });
  }
  async function getClassDetail() {
    const { roomID, pid } = route.params;
    try {
      const query = {
        uid: route.params.userID,
        room_id: roomID,
        pid,
      };
      console.log('mytag query', query);
      const classDetail = await getRoomInfoApi(query);
      return classDetail;
    } catch (error) {
      return null;
    }
  }
  return (
    <View>
      {/* <NavigationHeader navigation={navigation} title={'to delete: ClassRoom'}></NavigationHeader> */}
      <Text onPress={() => navigation.goBack()} style={{ color: 'black', fontSize: 20, padding: 20 }}>
        返回上一页
      </Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   mgt10: {
//     marginTop: 10,
//   },
// });

export default App;
