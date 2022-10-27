import React, {useCallback, useEffect, useState} from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SelectModalList, SelectItem, ClassInfo} from '../../../types/types';
import i18n from 'i18n-js';

export const ScheduleHeader: React.FC<{
  navigation: any;
  children: JSX.Element[];
}> = ({children}) => {
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
  });
  return (
    <View style={headerStyle.container}>
      <Text style={headerStyle.text}>{children[0]}</Text>
      <Text style={[headerStyle.text, headerStyle.title]}>{children[1]}</Text>
      <Text>{children[2]}</Text>
    </View>
  );
};

export const ArrangeButton: React.FC<{
  list: SelectModalList;
  onSelected: (selectedItem: SelectItem, index: number) => void;
}> = ({list, onSelected}) => {
  const headerStyle = StyleSheet.create({
    text: {
      fontSize: 16,
      color: '#040404',
      padding: 5,
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
      <ClassTypeModal />
    </View>
  );
  function ClassTypeModal() {
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

export const ScheduleItem: React.FC<{
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
          source={require('../../../assets/image/shutdown.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export const DefaultView = () => {
  const styles = StyleSheet.create({
    noMeeting: {
      width: 120,
      height: 120,
    },
    center: {alignItems: 'center', marginTop: 100},
  });
  return (
    <View style={styles.center}>
      <Image style={styles.noMeeting} source={require('../../../assets/image/no_meeting.png')} />
    </View>
  );
};
