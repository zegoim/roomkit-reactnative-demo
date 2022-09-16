import React, {useCallback, useEffect} from 'react';
import {Text, View} from 'react-native';
import {getRoomInfoApi} from '../../utils/fetch';
import {getToken} from '../../utils/utils';
import ZegoRoomkitSdk, {
  ZegoRoomkitJoinRoomConfig,
  setRoomParameterConfig,
} from 'zego_roomkit_reactnative_sdk';

import {SecretID} from '../../utils/config';
import {useRoomkit} from '../../context/roomkitContext';
import {useFocusEffect} from '@react-navigation/native';

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
}> = ({navigation, route}) => {
  const [roomkitstate] = useRoomkit();
  useFocusEffect(
    useCallback(() => {
      console.log('mytag focus');
      // joinRoom();
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
      const res = await ZegoRoomkitSdk.init({
        secretID: SecretID,
      });
      console.log('mytag init res', res);

      callbackRegister();
      let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
      const token = await getToken(deviceID);

      console.log('mytag deviceID in ClassRoom', deviceID);
      const classDetail = await getClassDetail();

      let roomParameter = {
        subject: classDetail && classDetail.subject,
        beginTimestamp: new Date().getTime(),
      } as setRoomParameterConfig;
      const {userID, roomID, pid, userName, role} = route.params;

      let joinConfig = {
        userName,
        userID,
        roomID,
        productID: pid,
        role,
        sdkToken: token,
      } as unknown as ZegoRoomkitJoinRoomConfig;
      console.log('mytag roomParameter', roomParameter);
      console.log('mytag joinConfig', joinConfig);

      ZegoRoomkitSdk.instance().setUserParameter({
        avatarUrl: 'https://img2.baidu.com/it/u=325567737,3478266281&fm=26&fmt=auto&gp=0.jpg',
        customIconUrl: 'http://www.gov.cn/guoqing/site1/20100928/001aa04acfdf0e0bfb6401.gif',
      });

      // UI config
      const {isBottomBarHiddenMode} = roomkitstate.roomUIConfig;
      ZegoRoomkitSdk.instance().setUIConfig({
        ...roomkitstate.roomUIConfig,
        bottomBarHiddenMode: !!isBottomBarHiddenMode ? 1 : 2,
      });
      // ZegoRoomkitSdk.instance().setAdvancedConfig({
      //   domain: Domain,
      // });

      await ZegoRoomkitSdk.instance().setRoomParameter(roomParameter);
      await ZegoRoomkitSdk.instance().joinRoom(joinConfig);
      console.log('mytag done');
    } catch (error) {
      console.log('mytag error in joinRoom', error);
    }
  }
  function callbackRegister() {
    ZegoRoomkitSdk.instance().on('memberLeaveRoom', () => {
      console.log('mytag touch memberLeaveRoom');
      navigation.goBack();
    });
    ZegoRoomkitSdk.instance().on('inRoomEventNotify', function () {
      console.log('mytag inRoomEventNotify', arguments);
      console.log('mytag touch inRoomEventNotify');
    });
    ZegoRoomkitSdk.instance().on('buttonEvent', function () {
      console.log('mytag buttonEvent', arguments);
    });
  }
  async function getClassDetail() {
    const {roomID, pid} = route.params;
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
      <Text onPress={() => navigation.goBack()} style={{color: 'black', fontSize: 20, padding: 20}}>
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
