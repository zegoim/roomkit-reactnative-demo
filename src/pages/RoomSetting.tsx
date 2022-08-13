import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import NavigationHeader from '../components/NavigationHeader';
import {Switch} from 'react-native-paper';

interface SelectModalList {
  title: string;
  items: string[];
}

const SwitchButton: React.FC<{
  children: string;
  style?: Object;
  getSwitch?: (isSwitchOn: boolean) => void;
}> = ({children, style, getSwitch}) => {
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
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    !!getSwitch && getSwitch(isSwitchOn);
  };

  return (
    <View style={[buttonStyle.container, style]}>
      <Text onPress={() => console.log('touch here')} style={[buttonStyle.left]}>
        {children}
      </Text>
      <Switch color="#2953FF" value={isSwitchOn} onValueChange={onToggleSwitch} />
    </View>
  );
};

const SwitchButtonMemo = memo(SwitchButton);

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [micMuted, setMicMuted] = useState(false);
  console.log('mytag micMuted', micMuted);

  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader navigation={navigation} title={i18n.t('room_setting')}></NavigationHeader>
      <SwitchButtonMemo
        getSwitch={useCallback((isSwitchOn: boolean) => setMicMuted(isSwitchOn), [])}
        style={styles.mgt10}>
        {i18n.t('room_setting')}
      </SwitchButtonMemo>
      <SwitchButtonMemo >{i18n.t('room_setting')}</SwitchButtonMemo>
      <SwitchButtonMemo >{i18n.t('room_setting')}</SwitchButtonMemo>
      <SwitchButtonMemo >{i18n.t('room_setting')}</SwitchButtonMemo>
      <SwitchButtonMemo >{i18n.t('room_setting')}</SwitchButtonMemo>
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
