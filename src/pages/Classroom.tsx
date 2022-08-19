import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../components/NavigationHeader';
import {Switch} from 'react-native-paper';
import {getSdkToken, getRoomInfo} from '../utils/fetch';
import {getToken} from '../utils/utils';
import md5 from 'md5';
import ZegoRoomkitSdk, {
  ZegoRoomkitJoinRoomConfig,
  setRoomParameterConfig,
} from 'zego_roomkit_reactnative_sdk';

import {ClassType, SecretID} from '../utils/config';
import {useRoomkit} from '../context/roomkitContext';
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
  const [roomkitstate, roomkitAction] = useRoomkit();
  useEffect(() => {
    console.log('mytag touch here');
    // joinRoom();
    return () => {
      console.log('mytag unmounted');
      // navigation.goBack();
    };
  });

  useFocusEffect(
    useCallback(() => {
      console.log('mytag focus');
      joinRoom();
      // Do something when the screen is focused
      // getClassList();
      return () => {
        console.log('mytag unfocues classRoom');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
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
    const {userID, roomID, pid} = route.params;
    try {
      const query = {
        uid: route.params.userID,
        room_id: roomID,
        pid,
      };
      console.log('mytag query', query);
      const classDetail = await getRoomInfo(query);
      return classDetail;
    } catch (error) {
      return null;
    }
  }
  return (
    <View>
      {/* <NavigationHeader navigation={navigation} title={'to delete: ClassRoom'}></NavigationHeader> */}
      <Text onPress={() => navigation.goBack()} style={{color: 'black', fontSize: 20,padding: 20}}>
        返回上一页
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
