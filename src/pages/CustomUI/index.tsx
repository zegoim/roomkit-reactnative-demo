import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../../components/NavigationHeader';
import {Switch} from 'react-native-paper';
import {useRoomkit} from '../../context/roomkitContext';
import {useCallback} from 'react';

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
  console.log('re-render in custom ui', content);

  const onToggleSwitch = useCallback(() => {
    !!getSwitch && getSwitch(!value);
  }, [getSwitch, value]);
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
  const {roomUIConfig} = roomkitstate;

  return (
    <ScrollView stickyHeaderIndices={[0]} style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader navigation={navigation} title={i18n.t('roomkit_setting_custom_ui')} />
      <SwitchButtonMemo
        value={roomUIConfig.isBottomBarHiddenMode}
        getSwitch={roomkitAction.setIsBottomBarHiddenMode}
        style={styles.mgt10}
        content={i18n.t('roomkit_custom_ui_hide_bottom_bar')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isChatHidden}
        getSwitch={roomkitAction.setIsChatHidden}
        content={i18n.t('roomkit_custom_ui_hide_chat')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isAttendeesHidden}
        getSwitch={roomkitAction.setIsAttendeesHidden}
        content={i18n.t('roomkit_custom_ui_hide_member')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isShareHidden}
        getSwitch={roomkitAction.setIsShareHidden}
        content={i18n.t('roomkit_custom_ui_hide_share')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isCameraHidden}
        getSwitch={roomkitAction.setIsCameraHidden}
        content={i18n.t('roomkit_custom_ui_hide_camera')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isMicrophoneHidden}
        getSwitch={roomkitAction.setIsMicrophoneHidden}
        content={i18n.t('roomkit_custom_ui_hide_mic')}
      />
      <SwitchButtonMemo
        value={roomUIConfig.isMoreHidden}
        getSwitch={roomkitAction.setIsMoreHidden}
        content={i18n.t('roomkit_custom_ui_hide_more')}
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
