import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, StyleSheet, Text, View, Image, TouchableOpacity, Modal} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../../components/NavigationHeader';
import {useRoomkit} from '../../context/roomkitContext';
import {Env} from '../../config';
import {ArrowButton, EnvSelectButton, LogoutComfirmButton} from './components/index';
import {SelectModalList, SelectItem} from '../../types/types';

const ArrowButtonMemo = memo(ArrowButton);
const App: React.FC<{route: any; navigation: any}> = ({route, navigation}) => {
  // const [envItem, setEnvItem] = useState(i18n.t('roomkit_quick_join_domestic_env'));
  const [roomkitstate, roomkitAction] = useRoomkit();

  const EnvList: SelectModalList = useMemo(() => {
    return {
      title: i18n.t('roomkit_room_schedule_type_web'),
      items: [
        {content: i18n.t('roomkit_quick_join_domestic_env'), value: Env.MainLand},
        {content: i18n.t('roomkit_quick_join_overseas_env'), value: Env.OverSeas},
      ],
    };
  }, []);
  const selectEnv = useCallback((selectedItem: SelectItem) => {
    // setEnvItem(selectedItem.value);
    roomkitAction.setEnv(selectedItem.value);
  }, []);

  const isFromSchedule = () => {
    return route.params instanceof Object && route.params.from === 'Schedule';
  };
  const goSetting = useCallback(() => {
    navigation.push('RoomSetting');
  }, []);
  const goCustomUI = useCallback(() => {
    navigation.push('CustomUI');
  }, []);
  const logout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader navigation={navigation} title={i18n.t('roomkit_setting')} />
      <ArrowButtonMemo onPress={goSetting} style={styles.mgt10}>
        {i18n.t('roomkit_setting')}
      </ArrowButtonMemo>
      <ArrowButtonMemo onPress={goCustomUI}>{i18n.t('roomkit_setting_custom_ui')}</ArrowButtonMemo>

      <EnvSelectButton value={roomkitstate.env} list={EnvList} onSelected={selectEnv} />

      <ArrowButtonMemo needArrow={false} rightContext={'v1.1.1'}>
        {i18n.t('roomkit_setting_version')}
      </ArrowButtonMemo>
      {/* <ArrowButtonMemo disabled={true} style={styles.mgt10}>
        {i18n.t('roomkit_feedback')}
      </ArrowButtonMemo>
      <ArrowButtonMemo disabled={true}>{i18n.t('roomkit_setting_upload_log')}</ArrowButtonMemo> */}
      {/* <ArrowButtonMemo disabled={true} style={styles.mgt10} needArrow={false} isCenterLayout={true}>
        {i18n.t('roomkit_setting_cancel_account')}
      </ArrowButtonMemo> */}

      {isFromSchedule() && (
        <ArrowButtonMemo
          onPress={logout}
          style={styles.mgt10}
          fontStyle={{color: '#F54326'}}
          needArrow={false}
          isCenterLayout={true}>
          {i18n.t('roomkit_setting_logout_room')}
        </ArrowButtonMemo>
      )}
      {/* <LogoutComfirmButton
          disabled={true}
          onSelected={useCallback((selectedItem: string, index: number) => {
            // logout todo
            // setEnvItem(selectedItem);
          }, [])}
        /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
