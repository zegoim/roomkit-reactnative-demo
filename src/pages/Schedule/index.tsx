import React, {useCallback, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  ScrollView,
  RefreshControl,
} from 'react-native';
import i18n from 'i18n-js';
import {ClassType, SecretID} from '../../utils/config';
import {createClassRoomApi, deleteClassApi, getClassRoomListApi} from '../../utils/fetch';
import {useRoomkit} from '../../context/roomkitContext';
import {getPid} from '../../utils/utils';
import {useFocusEffect} from '@react-navigation/native';
import {SelectModalList, SelectItem, ClassInfo} from '../../types/types';
import {DefaultView, ScheduleButton, ScheduleHeader, ScheduleItem} from './components';

let ClassTypeList: SelectModalList;

const initList = () => {
  ClassTypeList = {
    title: '',
    items: [
      {content: i18n.t('roomkit_schedule_1v1'), value: ClassType.Class_1V1},
      {content: i18n.t('roomkit_schedule_small_class'), value: ClassType.CLASS_SMALL},
      {content: i18n.t('roomkit_schedule_large_class'), value: ClassType.CLASS_LARGE},
    ],
  };
};

const getClassRoomList = ({deviceID, userID, token}: any) => {
  return getClassRoomListApi({
    begin_timestamp: new Date().getTime() - 12 * 60 * 60 * 1000,
    count: 20,
    device_id: deviceID,
    end_timestamp: 0,
    is_include_all: 0,
    status: 3,
    page: 1,
    uid: userID,
    sdk_token: token,
    secret_id: SecretID,
    verify_type: 3,
  });
};

const createClassRoom = ({userID, userName, className, classType, pid, token, deviceID}: any) => {
  const query = {
    uid: userID,
    subject: userName + '创建的' + className,
    room_type: classType,
    begin_timestamp: new Date().getTime() + 1000 * 60,
    duration: 30,
    max_attendee_count: classType === 3 ? undefined : classType === 1 ? 100 : 10000,
    host: {
      uid: userID,
    },
    attendees: [
      {
        uid: userID,
      },
    ],
    assistants: [
      {
        uid: 123123,
      },
      {
        uid: 456456,
      },
      {
        uid: 789789,
      },
    ],
    settings: {
      enable_attendee_cam: classType !== 5,
      enable_attendee_mic: classType !== 5,
      enable_host_cam: true,
      enable_host_mic: true,
      enable_attendee_share: classType !== 1 && classType !== 6,
      enable_chat: true,
      enable_attendee_draw: classType !== 1,
      is_auto_start: classType === 3 || classType === 6 || classType === 1,
      max_onstage_count: 2,
      is_private_room: false,
      enable_raise_hand: true,
    },
    pid,
    sdk_token: token,
    device_id: deviceID,
    secret_id: SecretID,
    verify_type: 3,
  };
  return createClassRoomApi(query);
};

const App: React.FC<{
  route: {
    params: {
      userName: string;
      userID: string;
      deviceID: string;
    };
  };
  navigation: any;
}> = ({route, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [roomkitstate, roomkitAction] = useRoomkit();
  useState(() => initList());
  useFocusEffect(
    useCallback(() => {
      getClassList();
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const {userName, userID, deviceID} = route.params;

  const selectItem = async (selectedItem: SelectItem) => {
    await createClass(selectedItem);
    await getClassList();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getClassList().then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClassList: () => Promise<void> = async () => {
    try {
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);

      const list = await getClassRoomList({
        deviceID,
        userID,
        token,
      });
      setClassList(list.data.room_list ? list.data.room_list : []);
      return list.data.room_list;
    } catch (error) {
      ToastAndroid.show(i18n.t('roomkit_Room_list_failed'), ToastAndroid.SHORT);
    }
  };

  const createClass = async (selectedItem: SelectItem) => {
    try {
      console.log('mytag selectedItem', selectedItem);

      const className = selectedItem.content;
      const classType = selectedItem.value;
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);
      console.log('mytag userName, userID', userName, userID);
      const result = await createClassRoom({
        userID,
        userName,
        className,
        classType,
        token,
        deviceID,
        pid: getPid(classType, roomkitstate.env, false),
      });
      return result;
    } catch (error) {
      // Toast.show({text1: `message:${data.ret.message}`, type: 'error'});
      ToastAndroid.show(i18n.t('roomkit_room_schedule_failed'), ToastAndroid.SHORT);
    }
  };

  const deleteRoom = async (roomID: string, pid: number) => {
    try {
      // const token = await getSdkTokenApi(userId);
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);

      const result = await deleteClassApi({
        uid: userID,
        room_id: String(roomID),
        pid: pid,
        sdk_token: token,
        device_id: deviceID,
        secret_id: SecretID,
        verify_type: 3,
      });
      console.log('mytag result', result);
      ToastAndroid.show(i18n.t('roomkit_room_delete_succeeded'), ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(i18n.t('roomkit_room_delete_failed'), ToastAndroid.SHORT);
    }
    getClassList();
  };

  const goSetting = () => {
    navigation.push('Setting', {
      from: route.name,
    });
  };

  const shutdownFun = (classItem: ClassInfo) => {
    deleteRoom(classItem.room_id, classItem.pid);
  };

  const joinClassRoom = (classItem: ClassInfo) => {
    console.log('mytag classItem', classItem);
    const routeParam = {
      roomID: classItem.room_id,
      userName,
      role: classItem.user_role,
      classType: classItem.room_type,
      userID: userID,
      pid: getPid(classItem.room_type, roomkitstate.env, false),
    };
    navigation.push('Classroom', routeParam);
  };
  return (
    <View style={{backgroundColor: '#F6F6F6', flex: 1}}>
      <ScheduleHeader navigation={navigation}>
        <Text onPress={goSetting}>设置</Text>
        <Text>{userName}的日程</Text>
        <ScheduleButton onSelected={selectItem} list={ClassTypeList} />
      </ScheduleHeader>

      <ScrollView
        style={{backgroundColor: `${classList.length ? '#F6F6F6' : 'white'}`}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {!classList.length ? (
          <DefaultView />
        ) : (
          <>
            {classList.map((classItem, index) => {
              return (
                <ScheduleItem
                  key={classItem.room_id}
                  classItem={classItem}
                  index={index}
                  onJoinClass={joinClassRoom}
                  onShutdown={shutdownFun}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
