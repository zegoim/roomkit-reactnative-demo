import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../components/NavigationHeader';
import {Switch} from 'react-native-paper';
import {getSdkToken, getRoomInfo} from '../utils/fetch';
import {getToken} from '../utils/utils';
import md5 from 'md5';
import ZegoRoomkitSdk from 'zego_roomkit_reactnative_sdk';


const App: React.FC<{navigation: any; route: any}> = ({navigation, route}) => {
  useEffect(() => {
    // joinRoom();
  }, []);

  async function getClassDetail(uid: number, roomID: string, pid: Number) {
    try {
      const query = {
        uid,
        room_id: roomID,
        pid,
      };
      const classDetail = await getRoomInfo(query);
      return classDetail;
    } catch (error) {
      return null;
    }
  }
  async function joinRoom() {
    const token = await getToken('device32652109476901');
    const {} = route.params;

    let roomParameter = {
      subject: 'etttte',
      beginTimestamp: new Date().getTime(),
      duration: 30,
      hostNickname: 'test007',
    };
    let joinConfig = {
      userName: 'usera',
      userID: 12345678,
      roomID: '21212987654321',
      productID: 1253,
      role: 1,
      sdkToken: token,
    };
    console.log(roomParameter);
    console.log(joinConfig);
    // await ZegoRoomkitSdk.instance().setRoomParameter(roomParameter);
    // let joinRes = await ZegoRoomkitSdk.instance().joinRoom(joinConfig);
  }

  console.log('mytag route', route);
  return (
    <View>
      <Text>this is class room</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
