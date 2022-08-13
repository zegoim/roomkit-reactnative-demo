import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from 'i18n-js';
import {Switch} from 'react-native-paper';

interface SelectModalList {
  title: string;
  items: string[];
}

const ScheduleHeader: React.FC<{navigation: any}> = ({navigation}) => {
  const headerStyle = StyleSheet.create({
    container: {
      height: 44,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backArrow: {
      position: 'absolute',
      left: 15,
      padding: 5,
    },
  });
  return (
    <View style={headerStyle.container}>
      <Text style={{fontSize: 17, color: '#040404'}}>设置</Text>
      <Text style={{fontSize: 17, color: '#040404'}}>日程</Text>
      <Text style={{fontSize: 17, color: '#040404'}}>安排</Text>
    </View>
  );
  
};

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [micMuted, setMicMuted] = useState(false);
  console.log('mytag micMuted', micMuted);

  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <ScheduleHeader navigation={navigation}></ScheduleHeader>
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
