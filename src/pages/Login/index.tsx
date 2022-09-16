import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import i18n from 'i18n-js';
import Toast from 'react-native-toast-message';
import ZegoRoomkitSdk from 'zego_roomkit_reactnative_sdk';
import {SelectModalList} from '../../types/types';
import {getUid, getPid} from '../../utils/utils';
import {ClassType, SecretID} from '../../utils/config';
import {useRoomkit} from '../../context/roomkitContext';
import {
  Logo,
  SettingBtn,
  InputBox,
  SelectBox,
  EnvTitle,
  Footer,
  EnvChooseButton,
} from './components/index';

enum RoleType {
  Student = 2,
  Assistant = 4,
  Host = 1,
}

const SelectBoxMemo = memo(SelectBox);
const InputBoxMemo = memo(InputBox);

let classTypeList: SelectModalList;
let roleTypeList: SelectModalList;

const initList = () => {
  classTypeList = {
    title: i18n.t('roomkit_room_schedule_type_web'),
    items: [
      {content: i18n.t('roomkit_schedule_1v1'), value: ClassType.Class_1V1},
      {content: i18n.t('roomkit_schedule_small_class'), value: ClassType.CLASS_SMALL},
      {content: i18n.t('roomkit_schedule_large_class'), value: ClassType.CLASS_LARGE},
    ],
  };
  roleTypeList = {
    title: i18n.t('roomkit_quick_join_select_role'),
    items: [
      {content: i18n.t('roomkit_quick_join_select_role_attendee'), value: RoleType.Student},
      {content: i18n.t('roomkit_quick_join_select_role_assistant'), value: RoleType.Assistant},
      {content: i18n.t('roomkit_quick_join_select_role_host'), value: RoleType.Host},
    ],
  };
};

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [roomID, setRoomID] = useState('');
  const [userName, setUserName] = useState('');
  const [classType, setClassType] = useState(0);
  const [roleType, setRole] = useState(0);
  const [roomkitstate, roomkitAction] = useRoomkit();
  // init select list
  useState(() => initList());

  const setRoomIDFun = useCallback((text: string) => setRoomID(text), []);
  const setUserNameFun = useCallback((text: string) => setUserName(text), []);
  const setClassTypeFun = useCallback((selectedItem: any) => {
    setClassType(selectedItem.value);
  }, []);
  const setRoleTypeFun = useCallback((selectedItem: any) => {
    setRole(selectedItem.value);
  }, []);

  const joinClassRoom = async () => {
    console.log('mytag Toast.show', Toast.show);
    if (!roomID) {
      return Toast.show({text1: i18n.t('roomkit_quick_join_input_id'), type: 'error'});
    }
    if (!userName) {
      return Toast.show({text1: i18n.t('roomkit_quick_join_input_nickname'), type: 'error'});
    }
    if (!classType) {
      return Toast.show({text1: i18n.t('roomkit_quick_join_select_room_type'), type: 'error'});
    }
    if (!roleType) {
      return Toast.show({text1: i18n.t('roomkit_quick_join_select_role'), type: 'error'});
    }
    const routeParam = {
      roomID,
      userName,
      role: roleType,
      classType,
      userID: getUid(userName),
      pid: getPid(classType, roomkitstate.env, false),
    };
    navigation.push('Classroom', routeParam);
  };

  const createRoom = useCallback(async () => {
    console.log('mytag before');
    await ZegoRoomkitSdk.init({
      secretID: SecretID,
    });
    console.log('mytag after');

    let deviceID = await ZegoRoomkitSdk.instance().getDeviceID();
    console.log('mytag deviceID in Login ', deviceID);
    const userName_deviceID = String(getUid(deviceID));
    const userID = getUid(String(userName_deviceID));
    const routeParam = {
      userName: userName_deviceID,
      userID,
      deviceID,
    };
    navigation.replace('Schedule', routeParam);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SettingBtn navigation={navigation} />
      <Logo />
      <InputBoxMemo
        placeholder={i18n.t('roomkit_quick_join_input_id')}
        onChangeText={setRoomIDFun}
      />
      <InputBoxMemo
        placeholder={i18n.t('roomkit_quick_join_input_nickname')}
        onChangeText={setUserNameFun}
      />
      <SelectBoxMemo
        placeholder={i18n.t('roomkit_quick_join_select_room_type')}
        list={classTypeList}
        onSelected={setClassTypeFun}
      />
      <SelectBoxMemo
        placeholder={i18n.t('roomkit_quick_join_select_role')}
        list={roleTypeList}
        onSelected={setRoleTypeFun}
      />
      <Text style={styles.joinClass} onPress={joinClassRoom}>
        {i18n.t('roomkit_quick_join_room')}
      </Text>
      <Text style={styles.createClass} onPress={createRoom}>
        {i18n.t('roomkit_create_room')}
      </Text>
      <Footer>
        <View>
          <EnvTitle />
          <EnvChooseButton envValue={roomkitstate.env} onChoose={roomkitAction.setEnv} />
        </View>
      </Footer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },

  joinClass: {
    backgroundColor: '#2953FF',
    borderRadius: 6,
    paddingVertical: 16,
    marginTop: 21,
    marginHorizontal: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  createClass: {
    textAlign: 'center',
    color: '#2953FF',
    marginTop: 25,
    fontSize: 15,
  },
});

export default App;
