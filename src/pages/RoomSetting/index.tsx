import React, {memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../../components/NavigationHeader';
import {Switch} from 'react-native-paper';
import {useRoomkit} from '../../context/roomkitContext';

const SwitchButton: React.FC<{
  content: string;
  style?: Object;
  value: boolean;
  getSwitch?: (isSwitchOn: boolean) => void;
}> = ({content, style, value, getSwitch}) => {
  const buttonStyle = StyleSheet.create({
    container: {
      height: 57,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 1,
    },
    left: {
      fontSize: 16,
      textAlign: 'center',
      color: 'black',
      marginLeft: 16,
      fontFamily: 'PingFang SC',
    },
    right: {
      marginRight: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  const onToggleSwitch = () => {
    !!getSwitch && getSwitch(!value);
  };
  return (
    <View style={[buttonStyle.container, style]}>
      <Text style={[buttonStyle.left]}>{content}</Text>
      <Switch color="#2953FF" value={value} onValueChange={onToggleSwitch} />
    </View>
  );
};

const SwitchButtonMemo = memo(SwitchButton);

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [roomkitstate, roomkitAction] = useRoomkit();
  const {roomSettings, roomUIConfig} = roomkitstate;

  return (
    <ScrollView stickyHeaderIndices={[0]} style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader navigation={navigation} title={i18n.t('roomkit_setting_room')} />
      <SwitchButtonMemo
        value={roomSettings.isMicrophoneOnWhenJoiningRoom}
        getSwitch={roomkitAction.setIsMicrophoneOnWhenJoiningRoom}
        style={styles.mgt10}
        content={i18n.t('roomkit_setting_room_mic_off_when_joining')}
      />
      <SwitchButtonMemo
        value={roomSettings.isCameraOnWhenJoiningRoom}
        getSwitch={roomkitAction.setIsCameraOnWhenJoiningRoom}
        content={i18n.t('roomkit_setting_room_camera_off_when_joining')}
      />
      <SwitchButtonMemo
        value={roomSettings.beautifyMode}
        getSwitch={roomkitAction.setBeautifyMode}
        content={i18n.t('roomkit_setting_room_beautify')}
        style={styles.mgt10}
      />
      <SwitchButtonMemo
        value={roomSettings.previewVideoMirrorMode}
        getSwitch={roomkitAction.setPreviewVideoMirrorMode}
        content={i18n.t('roomkit_setting_room_preview_mirror')}
      />
      <SwitchButtonMemo
        value={roomSettings.videoFitMode}
        getSwitch={roomkitAction.setVideoFitMode}
        content={i18n.t('roomkit_setting_room_video_fit')}
      />
      {/* L3 todo */}
      <SwitchButtonMemo
        value={false}
        content={'todo >> ' + i18n.t('roomkit_setting_item_L3')}
        style={styles.mgt10}
      />

      <SwitchButtonMemo
        value={roomUIConfig.enableHandwriting}
        getSwitch={roomkitAction.setEnableHandwriting}
        content={i18n.t('roomkit_enable_hand_writing')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isFixedInOutMessage}
        getSwitch={roomkitAction.SetIsFixedInOutMessage}
        content={i18n.t('roomkit_show_in_out_room_msg')}
      />
      <SwitchButtonMemo value={false} content={'todo >> ' + i18n.t('roomkit_msg_avatar')} />
      <SwitchButtonMemo
        value={roomUIConfig.isMemberLeaveRoomMessageHidden}
        getSwitch={roomkitAction.setIsMemberLeaveRoomMessageHidden}
        content={i18n.t('roomkit_hide_in_out_msg')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
