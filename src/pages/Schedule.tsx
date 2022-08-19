import React, {Children, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import i18n, {translate} from 'i18n-js';
import {Switch} from 'react-native-paper';
import {ClassType, SecretID} from '../utils/config';
import {createClassRoom, deleteClass, getClassRoomList} from '../utils/fetch';
import {useRoomkit} from '../context/roomkitContext';
import {getPid} from '../utils/utils';

interface SelectItem {
  content: string;
  value: number;
}
interface SelectModalList {
  items: SelectItem[];
}

const ScheduleHeader: React.FC<{
  navigation: any;
  children: JSX.Element[];
}> = ({navigation, children}) => {
  const headerStyle = StyleSheet.create({
    container: {
      height: 44,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    backArrow: {
      position: 'absolute',
      left: 15,
      padding: 5,
    },
    text: {
      fontSize: 16,
      color: '#040404',
    },
    title: {
      fontSize: 18,
    },
    rightTitle: {
      color: '#2953FF',
    },
  });
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.text}>{children[0]}</Text>
      <Text style={[headerStyle.text, headerStyle.title]}>{children[1]}</Text>
      <Text>{children[2]}</Text>
    </View>
  );
};

const ScheduleButton: React.FC<{
  list: SelectModalList;
  onSelected: (selectedItem: SelectItem, index: number) => void;
}> = ({list, onSelected}) => {
  const headerStyle = StyleSheet.create({
    text: {
      fontSize: 16,
      color: '#040404',
    },
    rightTitle: {
      color: '#2953FF',
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedVal, setSelectedVal] = useState(0);
  // const [selectedContent, setSelectedContent] = useState('');
  return (
    <View>
      <Text
        style={[headerStyle.text, headerStyle.rightTitle]}
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}>
        {i18n.t('roomkit_main_schedule')}
      </Text>
      <EnvModal />
    </View>
  );
  function EnvModal() {
    const modalStyle = StyleSheet.create({
      modalContainer: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
      },
      modalView: {
        position: 'absolute',
        top: 42,
        right: 10,
        width: 110,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderRadius: 3,
      },
      shadow: {
        shadowColor: 'rgba(101, 102, 110, 1)',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 8,
      },
      modalRow: {
        paddingVertical: 15,
        textAlign: 'center',
        color: '#0F0F0F',
        fontSize: 15,
      },
      borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFE1',
      },
    });
    return (
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={modalStyle.modalContainer}>
          <View style={[modalStyle.modalView, modalStyle.shadow]}>
            {list.items.map((item: SelectItem, index: number) => (
              <Text
                onPress={() => {
                  onSelected(item, index);
                  // setSelectedVal(item.value);
                  // setSelectedContent(item.content);
                  setModalVisible(false);
                }}
                key={index}
                style={[
                  modalStyle.modalRow,
                  index < list.items.length - 1 && modalStyle.borderBottom,
                ]}>
                {item.content}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

interface ClassInfo {
  attendee_count: number;
  begin_timestamp: number;
  create_timestamp: number;
  duration: number;
  end_timestamp: number;
  locked: number;
  max_attendee_count: number;
  max_user_count: number;
  pid: number;
  room_id: string;
  room_type: number;
  status: number;
  subject: string;
  user_role: number;
}

const ScheduleItem: React.FC<{
  classItem: ClassInfo;
  index: number;
  onShutdown: (classItem: ClassInfo) => void;
  onJoinClass: (classItem: ClassInfo) => void;
}> = ({classItem, index, onShutdown, onJoinClass}) => {
  const itemStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      marginTop: 16,
      marginHorizontal: 16,
    },
    timeBox: {
      flexDirection: 'column',
      paddingRight: 14,
      borderRightWidth: 1,
      borderColor: '#F1F1F1',
    },
    time: {
      color: '#303030',
      fontSize: 14,
    },
    subjectBox: {
      marginLeft: 14,
      flexGrow: 1,
    },
    title: {
      fontSize: 17,
      color: '#303030',
    },
    addClassBar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    addClassBtn: {
      width: 60,
      paddingVertical: 7,
      fontSize: 13,
      borderRadius: 4,
      backgroundColor: '#2953FF',
      textAlign: 'center',
      color: 'white',
    },
    shutdown: {
      position: 'absolute',

      right: 7,
      top: 7,
    },
  });

  useEffect(() => {
    console.log('mytag classItem.room_id', classItem.room_id);
  }, [classItem]);
  const getTime = (timeStamp: number) => {
    const date = new Date(timeStamp);
    const patchZego = (time: number) => `${time < 10 ? '0' : ''}${time}`;
    const hour = patchZego(date.getHours());
    const min = patchZego(date.getMinutes());

    return `${hour}:${min}`;
  };
  return (
    <View style={itemStyle.container}>
      <View style={itemStyle.timeBox}>
        <Text style={itemStyle.time}>{getTime(classItem.begin_timestamp)}</Text>
        <Text style={[itemStyle.time, {marginTop: 14}]}>{getTime(classItem.end_timestamp)}</Text>
      </View>
      <View style={itemStyle.subjectBox}>
        <Text style={itemStyle.title}>{classItem.subject}</Text>
        <View style={itemStyle.addClassBar}>
          <View style={{paddingBottom: 3, flexDirection: 'row'}}>
            <Text>{i18n.t('roomkit_room_id')} </Text>
            <Text>{classItem.room_id}</Text>
          </View>
          <Text
            style={itemStyle.addClassBtn}
            onPress={() => {
              onJoinClass(classItem);
            }}>
            {i18n.t('roomkit_room_join')}
          </Text>
          {/* </TouchableOpacity> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          onShutdown(classItem);
        }}
        style={itemStyle.shutdown}
        activeOpacity={1}>
        <Image
          style={{width: 15, height: 15}}
          source={require('../assets/image/shutdown.png')}></Image>
      </TouchableOpacity>
    </View>
  );
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
  useEffect(() => {
    getClassList();
  }, [route]);

  const ClassTypeList: SelectModalList = useMemo(() => {
    return {
      items: [
        {content: i18n.t('roomkit_schedule_1v1'), value: ClassType.Class_1V1},
        {content: i18n.t('roomkit_schedule_small_class'), value: ClassType.CLASS_SMALL},
        {content: i18n.t('roomkit_schedule_large_class'), value: ClassType.CLASS_LARGE},
      ],
    };
  }, []);

  const {userName, userID, deviceID} = route.params;

  const selectItem = async (selectedItem: SelectItem) => {
    await createClass(selectedItem);
    const roomList = await getClassList();
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    getClassList().then(() => setRefreshing(false));
  }, []);

  const getClassList: () => Promise<void> = async () => {
    try {
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);
      const list = await getClassRoomList({
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
      console.log('mytag list.data', list.data);
      setClassList(list.data.room_list ? list.data.room_list : []);
      return list.data.room_list;
    } catch (error) {
      // ToastAndroid.show(`error message:${data.ret.message}`, ToastAndroid.SHORT);
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
        pid: getPid(classType, roomkitstate.env, false),
        sdk_token: token,
        device_id: deviceID,
        secret_id: SecretID,
        verify_type: 3,
      };
      const result = await createClassRoom(query);

      return result;
    } catch (error) {
      // Toast.show({text1: `message:${data.ret.message}`, type: 'error'});
      ToastAndroid.show(i18n.t('roomkit_room_schedule_failed'), ToastAndroid.SHORT);

      // console.log('mytag error', error);
    }
  };
  const deleteRoom = async (roomID: string, pid: number) => {
    try {
      // const token = await getSDKToken(userId);
      const token = roomkitstate.token
        ? roomkitstate.token
        : await roomkitAction.updateToken(deviceID);

      const result = await deleteClass({
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
    // deleteRoom(classItem.room_id, classItem.pid);
  };
  return (
    <View style={{backgroundColor: '#F6F6F6', flex: 1}}>
      <ScheduleHeader navigation={navigation}>
        <Text onPress={goSetting}>设置</Text>
        <Text>{userName}的日程</Text>
        <ScheduleButton onSelected={selectItem} list={ClassTypeList}></ScheduleButton>
      </ScheduleHeader>

      <ScrollView
        style={{backgroundColor: `${classList.length ? '#F6F6F6' : 'white'}`}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {!classList.length ? (
          <View style={{alignItems: 'center', marginTop: 100}}>
            <Image
              style={styles.noMeeting}
              source={require('../assets/image/no_meeting.png')}></Image>
          </View>
        ) : (
          <>
            {classList.map((classItem, index) => {
              return (
                <ScheduleItem
                  key={classItem.room_id}
                  classItem={classItem}
                  index={index}
                  onJoinClass={joinClassRoom}
                  onShutdown={shutdownFun}></ScheduleItem>
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
  noMeeting: {
    width: 120,
    height: 120,
  },
});

export default App;
