import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import i18n from 'i18n-js';
import { ClassType, SecretID } from '../../config';
import { createClassRoomApi, deleteClassApi, getClassRoomListApi, getRoomInfoApi } from '../../api/requestApi';
import { useRoomkit } from '../../context/roomkitContext';
import { getPid } from '../../utils/utils';
import { useFocusEffect } from '@react-navigation/native';
import { SelectModalList, SelectItem, ClassInfo } from '../../types/types';
import { DefaultView, ClassTypesButton, ScheduleHeader, ScheduleItem } from './components';
import Toast from 'react-native-toast-message';
import { LoadingContext } from "../../App"
import { joinRoom } from '../../api/roomkitApi';


let ClassTypeList: SelectModalList;


const getClassRoomList = ({ deviceID, userID, token }: any) => {
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

const createClassRoom = ({ userID, userName, className, classType, pid, token, deviceID }: any) => {
  const query = {
    uid: userID,
    subject: userName +  i18n.t('belong') + className.toLowerCase(),
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

const initList = () => {
  ClassTypeList = {
    title: '',
    items: [
      { content: i18n.t('roomkit_schedule_1v1'), value: ClassType.Class_1V1 },
      { content: i18n.t('roomkit_schedule_small_class'), value: ClassType.CLASS_SMALL },
      { content: i18n.t('roomkit_schedule_large_class'), value: ClassType.CLASS_LARGE },
    ],
  };
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
}> = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [roomkitstate, roomkitAction] = useRoomkit();

  // @ts-ignore
  const { setSpinner } = useContext(LoadingContext)

  useState(() => initList());
  useEffect(() => {
    getClassList();
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     getClassList();
  //     return () => { };
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []),
  // );
  const { userName, userID, deviceID } = route.params;

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
      setSpinner(true)
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);

      const list = await getClassRoomList({
        deviceID,
        userID,
        token,
      });
      setClassList(list.data.room_list ? list.data.room_list : []);
      setSpinner(false)

      return list.data.room_list;
    } catch (error) {
      setSpinner(false)
      Toast.show({ text1: i18n.t('roomkit_Room_list_failed'), type: 'error' });
    }
  };

  const createClass = async (selectedItem: SelectItem) => {
    try {
      console.log('mytag selectedItem', selectedItem);
      setSpinner(true)

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
      setSpinner(false)
      return result;
    } catch (error) {
      setSpinner(false)
      // Toast.show({text1: `message:${data.ret.message}`, type: 'error'});
      Toast.show({ text1: i18n.t('roomkit_room_schedule_failed'), type: 'error' });

    }
  };

  const deleteRoom = async (roomID: string, pid: number) => {
    try {
      setSpinner(true)

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
      await getClassList();
      setSpinner(false)
      Toast.show({ text1: i18n.t('roomkit_room_delete_succeeded'), type: 'success' });
    } catch (error) {
      setSpinner(false)
      Toast.show({ text1: i18n.t('roomkit_room_delete_failed'), type: 'error' });
    }
  };

  const goSetting = () => {
    navigation.push('Setting', {
      from: route.name,
    });
  };

  const shutdownFun = (classItem: ClassInfo) => {
    deleteRoom(classItem.room_id, classItem.pid);
  };

  const joinClassRoom = async (classItem: ClassInfo) => {
    setSpinner(true)
    try {
      console.log('mytag classItem', classItem);
      const routeParam = {
        roomID: classItem.room_id,
        userName,
        role: classItem.user_role,
        classType: classItem.room_type,
        userID: userID,
        pid: getPid(classItem.room_type, roomkitstate.env, false),
        roomkitstate,
        subject: classItem.room_id
      };

      console.log('mytag routeParam', routeParam)
      // navigation.push('Classroom', routeParam);
      const classDetail = await getClassDetail({ roomID: classItem.room_id, pid: getPid(classItem.room_type, roomkitstate.env, false), userID })
      if (classDetail && classDetail.data) routeParam.subject = classDetail.data.subject
      setSpinner(false)
      joinRoom(routeParam)
    } catch (error) {
      setSpinner(false)
    }
  };

  async function getClassDetail({ roomID, pid, userID }: any) {
    try {
      const query = {
        uid: userID,
        room_id: roomID,
        pid,
      };
      const classDetail = await getRoomInfoApi(query);
      return classDetail;
    } catch (error) {
      return null;
    }
  }

  return (
    <View style={{ backgroundColor: '#F6F6F6', flex: 1 }}>
      <ScheduleHeader navigation={navigation}>
        <Text onPress={goSetting}>{i18n.t('roomkit_setting')}</Text>
        <Text>{i18n.t('roomkit_main_page')}</Text>
        <ClassTypesButton onSelected={selectItem} list={ClassTypeList} />
      </ScheduleHeader>
      <ScrollView
        style={{ backgroundColor: `${classList.length ? '#F6F6F6' : 'white'}` }}
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
