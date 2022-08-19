import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  TouchableHighlight,
  SectionList,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import i18n from 'i18n-js';
import NavigationHeader from '../components/NavigationHeader';
import {useRoomkit} from '../context/roomkitContext';
import {Env} from '../utils/config';

interface SelectItem {
  content: string;
  value: number;
}
interface SelectModalList {
  title: string;
  items: SelectItem[];
}

const TouchableButton: React.FC<{
  children: string;
  needArrow?: boolean;
  style?: Object;
  fontStyle?: Object;
  rightContext?: string;
  isCenterLayout?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}> = ({
  children,
  needArrow = true,
  style,
  fontStyle,
  rightContext,
  isCenterLayout = false,
  disabled,
  onPress,
}) => {
  const buttonStyle = StyleSheet.create({
    container: {
      height: 57,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: !isCenterLayout ? 'space-between' : 'center',
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
    disabled: {
      backgroundColor: '#f3f3f3',
      color: '#aeaeae',
    },
  });

  console.log('mytag re-render', children);
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('mytag ');
        onPress && onPress();
      }}
      disabled={disabled}
      activeOpacity={1}
      style={[buttonStyle.container, style, !!disabled && buttonStyle.disabled]}>
      <Text style={[buttonStyle.left, fontStyle, !!disabled && buttonStyle.disabled]}>
        {children}
      </Text>
      <View style={buttonStyle.right}>
        {!!rightContext && <Text style={{fontSize: 14}}>{rightContext}</Text>}
        {!!needArrow && (
          <Image
            style={{width: 14, height: 14}}
            source={require('../assets/image/right_arrow.png')}></Image>
        )}
      </View>
    </TouchableOpacity>
  );
};

const EnvSelectButton: React.FC<{
  value: Env;
  list: SelectModalList;
  onSelected: (selectedItem: SelectItem, index: number) => void;
}> = ({list, value, onSelected}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(i18n.t('roomkit_quick_join_domestic_env'));
  const [selectedVal, setSelectedVal] = useState(0);
  const [selectedContent, setSelectedContent] = useState(i18n.t('roomkit_quick_join_domestic_env'));

  useEffect(() => {
    list.items.forEach((item: SelectItem) => {
      if (value === item.value) {
        setSelectedVal(item.value);
        setSelectedContent(item.content);
      }
    });
  }, []);
  return (
    <View>
      <TouchableButton
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        rightContext={selectedContent}>
        {i18n.t('roomkit_quick_join_access_env')}
      </TouchableButton>
      <EnvModal />
    </View>
  );
  function EnvModal() {
    const modalStyle = StyleSheet.create({
      modalContainer: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'rgba(100,100,100,0.5)',
      },
      modalView: {
        width: '100%',
        backgroundColor: 'white',
      },
      modalRow: {
        padding: 17,
        textAlign: 'center',
        color: '#0F0F0F',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFE1',
      },
      modalHeader: {
        color: '#565E66',
        fontSize: 13,
      },
    });
    return (
      <Modal
        animationType="slide"
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
          <View style={modalStyle.modalView}>
            <Text style={[modalStyle.modalRow, modalStyle.modalHeader]}>{list.title}</Text>
            {list.items.map((item: SelectItem, index: number) => (
              <Text
                onPress={() => {
                  onSelected(item, index);
                  setSelectedVal(item.value);
                  setSelectedContent(item.content);
                  setModalVisible(false);
                }}
                key={index}
                style={[modalStyle.modalRow, item.value === selectedVal ? {color: '#2953FF'} : {}]}>
                {item.content}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

const LogoutComfirmButton: React.FC<{
  onSelected: (selectedItem: string, index: number) => void;
  disabled?: boolean;
}> = ({onSelected, disabled}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <TouchableButton
        disabled={disabled}
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        needArrow={false}
        isCenterLayout={true}
        fontStyle={{color: '#F54326'}}>
        {i18n.t('roomkit_setting_logout')}
      </TouchableButton>
      <LogoutModal />
    </View>
  );
  function LogoutModal() {
    const modalStyle = StyleSheet.create({
      modalContainer: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'rgba(100,100,100,0.5)',
      },
      modalView: {
        width: '100%',
        padding: 10,
      },
      modalRow: {
        marginBottom: 4,
        fontSize: 16,
        borderRadius: 10,
        backgroundColor: 'white',
      },
      text: {
        padding: 12,
        color: '#0F0F0F',
        textAlign: 'center',
        fontSize: 16,
      },
      modalHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFE1',
        color: '#565E66',
        fontSize: 13,
      },
    });
    return (
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            console.log('mytag touch modal toggle');
            setModalVisible(!modalVisible);
          }}
          style={[modalStyle.modalContainer]}>
          <View style={modalStyle.modalView}>
            <View style={[modalStyle.modalRow]}>
              <Text style={[modalStyle.text, modalStyle.modalHeader]}>
                {i18n.t('setting_logout_title')}
              </Text>
              <Text
                onPress={() => {
                  console.log('mytag touch confirm');
                }}
                style={[modalStyle.text, {color: '#F54326'}]}>
                {i18n.t('setting_logout_btn_ok')}
              </Text>
            </View>
            <View style={[modalStyle.modalRow]}>
              <Text
                onPress={() => {
                  console.log('mytag touch cancel');
                }}
                style={[modalStyle.text]}>
                {i18n.t('setting_logout_btn_cancle')}
              </Text>
            </View>

            {/* {list.items.map((item: any, index: number) => (
              <Text
                onPress={() => {
                  onSelected(item, index);
                  setSelectedItem(item);
                  setModalVisible(false);
                }}
                key={index}
                style={[modalStyle.modalRow, item === selectedItem ? {color: '#2953FF'} : {}]}>
                {item}
              </Text>
            ))} */}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

// const TouchableButtonMemo = memo(TouchableButton);
// const EnvSelectButtonMemo = memo(EnvSelectButton);

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
  const selectEnv = useCallback((selectedItem: SelectItem, index: number) => {
    // setEnvItem(selectedItem.value);
    roomkitAction.setEnv(selectedItem.value);
  }, []);

  const isFromSchedule = () => {
    return route.params instanceof Object && route.params.from === 'Schedule';
  };
  const goSetting = () => {
    navigation.push('RoomSetting');
  };
  const goCustomUI = () => {
    navigation.push('CustomUI');
  };
  const logout = () => {
    roomkitAction.init();
    navigation.navigate('Login');
  };

  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader
        navigation={navigation}
        title={i18n.t('roomkit_setting')}></NavigationHeader>
      <TouchableButton onPress={goSetting} style={styles.mgt10}>
        {i18n.t('roomkit_setting')}
      </TouchableButton>
      <TouchableButton onPress={goCustomUI}>{i18n.t('roomkit_setting_custom_ui')}</TouchableButton>

      <EnvSelectButton value={roomkitstate.env} list={EnvList} onSelected={selectEnv} />

      <TouchableButton needArrow={false} rightContext={'v1.1.1'}>
        {i18n.t('roomkit_setting_version')}
      </TouchableButton>
      <TouchableButton disabled={true} style={styles.mgt10}>
        {i18n.t('roomkit_feedback')}
      </TouchableButton>
      <TouchableButton disabled={true}>{i18n.t('roomkit_setting_upload_log')}</TouchableButton>
      <TouchableButton disabled={true} style={styles.mgt10} needArrow={false} isCenterLayout={true}>
        {i18n.t('roomkit_setting_cancel_account')}
      </TouchableButton>

      {!!isFromSchedule() ? (
        <TouchableButton
          onPress={logout}
          fontStyle={{color: '#F54326'}}
          needArrow={false}
          isCenterLayout={true}>
          {i18n.t('roomkit_setting_logout_room')}
        </TouchableButton>
      ) : (
        <LogoutComfirmButton
          disabled={true}
          onSelected={useCallback((selectedItem: string, index: number) => {
            // logout todo
            // setEnvItem(selectedItem);
          }, [])}></LogoutComfirmButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
