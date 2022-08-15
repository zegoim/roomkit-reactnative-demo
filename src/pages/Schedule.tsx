import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
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
} from 'react-native';
import i18n, {translate} from 'i18n-js';
import {Switch} from 'react-native-paper';

interface SelectModalList {
  items: string[];
}

const ScheduleHeader: React.FC<{
  navigation: any;
  modalList: SelectModalList;
  onSelected: (selectedItem: string, index: number) => void;
}> = ({navigation, modalList, onSelected}) => {
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
      <Text style={headerStyle.text}>设置</Text>
      <Text style={[headerStyle.text, headerStyle.title]}>日程</Text>
      {/* <Text style={[headerStyle.text, headerStyle.rightTitle]}>安排</Text> */}
      <ScheduleButton
        list={modalList}
        onSelected={function (selectedItem: string, index: number): void {
          onSelected(selectedItem, index);
        }}></ScheduleButton>
    </View>
  );
};

const ScheduleButton: React.FC<{
  list: SelectModalList;
  onSelected: (selectedItem: string, index: number) => void;
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
  const [selectedItem, setSelectedItem] = useState(i18n.t('roomkit_quick_join_domestic_env'));
  return (
    <View>
      <Text
        style={[headerStyle.text, headerStyle.rightTitle]}
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}>
        {i18n.t('roomkit_main_schedule')}
      </Text>
      {/* <TouchableButton
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        customRight={selectedItem}>
        {i18n.t('roomkit_quick_join_access_env')}
      </TouchableButton> */}
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
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('mytag Modal has been closed.');
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            console.log('mytag touch modal toggle');
            setModalVisible(!modalVisible);
          }}
          style={modalStyle.modalContainer}>
          <View style={[modalStyle.modalView, modalStyle.shadow]}>
            {list.items.map((item: any, index: number) => (
              <Text
                onPress={() => {
                  onSelected(item, index);
                  setSelectedItem(item);
                  setModalVisible(false);
                }}
                key={index}
                style={[modalStyle.modalRow, index < list.items.length - 1 && modalStyle.borderBottom]}>
                {item}
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

const ScheduleItem: React.FC<{classItem: ClassInfo; index: number; onShutdown: () => void; onAddclass: () => void}> = ({
  classItem,
  index,
  onShutdown,
  onAddclass,
}) => {
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
  const getTime = (timeStamp: number) => {
    const date = new Date(timeStamp);
    return `${date.getHours()}:${date.getMinutes()}`;
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
          <Text style={{paddingBottom: 3}}>课程ID:{classItem.room_id}</Text>
          {/* <TouchableOpacity onPress={() => {}} activeOpacity={1}> */}
          <Text
            style={itemStyle.addClassBtn}
            onPress={() => {
              onAddclass();
            }}>
            加入
          </Text>
          {/* </TouchableOpacity> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          onShutdown();
        }}
        style={itemStyle.shutdown}
        activeOpacity={1}>
        <Image style={{width: 15, height: 15}} source={require('../assets/image/shutdown.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [micMuted, setMicMuted] = useState(false);
  const a: number[] = [1, 2, 3];
  const [classList, setClassList] = useState<ClassInfo[]>([
    {
      attendee_count: 4,
      begin_timestamp: 1660549927049,
      create_timestamp: 1660549867189,
      duration: 30,
      end_timestamp: 1660551727049,
      locked: 0,
      max_attendee_count: 10000,
      max_user_count: 10000,
      pid: 1253,
      room_id: '926182952',
      room_type: 5,
      status: 2,
      subject: '13551463创建的大班课',
      user_role: 1,
    },
  ]);

  const selectItem = (selectedItem: string, index: number) => {
    enum CLASSTYPE {
      CLASS_1V1 = 0,
      CLASS_SMALL = 1,
      CLASS_LARGE = 1,
    }
    console.log('mytag selectedItem', selectedItem);
    console.log('mytag index', index);
    if (index === CLASSTYPE.CLASS_1V1) {
      const classInfo = {
        attendee_count: 4,
        begin_timestamp: 1660549927049,
        create_timestamp: 1660549867189,
        duration: 30,
        end_timestamp: 1660551727049,
        locked: 0,
        max_attendee_count: 10000,
        max_user_count: 10000,
        pid: 1253,
        room_id: '926182952',
        room_type: 5,
        status: 2,
        subject: '13551463创建的大班课',
        user_role: 1,
      };
      setClassList(classList.concat(classInfo));
      console.log('mytag classList', classList);
      // ToastAndroid.showWithGravity('this is message', ToastAndroid.SHORT, ToastAndroid.CENTER);
      // Alert.alert('this is message');
    }
  };
  return (
    <View style={{backgroundColor: '#F6F6F6', flex: 1}}>
      <ScheduleHeader
        navigation={navigation}
        onSelected={selectItem}
        modalList={{
          items: [
            i18n.t('roomkit_schedule_1v1'),
            i18n.t('roomkit_schedule_small_class'),
            i18n.t('roomkit_schedule_large_class'),
          ],
        }}></ScheduleHeader>
      {
        // !classList.length ? (
        //   <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        //     <Image style={styles.noMeeting} source={require('../assets/image/no_meeting.png')}></Image>
        //   </View>
        // ) :
        // scroll
        <ScrollView style={{backgroundColor: 'pink'}}>
          {classList.map((classItem, index) => {
            return (
              <ScheduleItem
                key={index}
                classItem={classItem}
                index={index}
                onAddclass={() => console.log('mytag onAddclass', index)}
                onShutdown={() => console.log('mytag onShutdown', index)}></ScheduleItem>
            );
          })}
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
  noMeeting: {
    transform: [{translateX: -60}, {translateY: -60}],
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 120,
    height: 120,
  },
});

export default App;
