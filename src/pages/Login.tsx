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

interface SelectModalList {
  title: string;
  items: string[];
}
type textFunction = (text: string) => void;

const ENV = {
  CHINA: 'roomkit_quick_join_access_env_mainland',
  INTERNATIONAL: 'roomkit_quick_join_access_env_overseas',
};

const Logo: React.FC<{}> = () => {
  const logoStyls = StyleSheet.create({
    loginLogo: {
      marginTop: 20,
      marginLeft: 31,
      width: 127,
      height: 25,
      marginBottom: 39,
    },
  });
  return <Image style={logoStyls.loginLogo} source={require('../assets/image/logo.png')}></Image>;
};

const SettingBtn: React.FC<{navigation: any}> = ({navigation}) => {
  const settingStyle = StyleSheet.create({
    settingBtnText: {
      fontSize: 18,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
  });
  return (
    <View style={{alignItems: 'flex-end'}}>
      <Text
        onPress={() => {
          navigation.push('Setting');
          console.log('mytag touch setting');
        }}
        style={settingStyle.settingBtnText}>
        {i18n.t('roomkit_setting')}
      </Text>
    </View>
  );
};

const InputBox: React.FC<{placeholder: string; onChangeText?: textFunction}> = ({placeholder, onChangeText}) => {
  const inputBoxStyle = StyleSheet.create({
    inputBox: {
      marginHorizontal: 30,
      marginBottom: 14,
    },
    inputBoxInput: {
      fontSize: 16,
      backgroundColor: '#F4F4F4',
      borderRadius: 6,
      paddingLeft: 16,
    },
  });
  console.log('mytag input box has rerender', placeholder);
  return (
    <View style={[inputBoxStyle.inputBox]}>
      <TextInput
        style={inputBoxStyle.inputBoxInput}
        placeholder={placeholder}
        onChangeText={onChangeText ? onChangeText : () => {}}
      />
    </View>
  );
};

const SelectBox: React.FC<{
  placeholder: string;
  list: SelectModalList;
  onSelected: (selectedItem: string, index: number) => void;
}> = ({placeholder, list, onSelected}) => {
  console.log('mytag touch here');
  const seletBoxStyle = StyleSheet.create({
    inputBox: {
      marginHorizontal: 30,
      marginBottom: 14,
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  return (
    <View style={[seletBoxStyle.inputBox]}>
      <SelectInput />
      <SelectModal />
    </View>
  );

  function SelectInput() {
    const inputStyle = StyleSheet.create({
      inputBoxInput: {
        fontSize: 16,
        backgroundColor: '#F4F4F4',
        borderRadius: 6,
        paddingLeft: 16,
      },
      selectBox: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    });
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('mytag touch input toggle');
          setModalVisible(!modalVisible);
        }}
        activeOpacity={1}
        style={[inputStyle.inputBoxInput, inputStyle.selectBox, {alignItems: 'center'}]}>
        <Text style={{fontSize: 16, color: !!selectedItem ? '#0F0F0F' : '#868CA0'}}>
          {!!selectedItem ? selectedItem : placeholder}
        </Text>
        <Image style={{width: 12, height: 12}} source={require('../assets/image/down_arrow.png')}></Image>
      </TouchableOpacity>
    );
  }

  function SelectModal() {
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
            {list.items.map((item: any, index: number) => (
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
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

const TouchableButton: React.FC<{children: string; style: Object; onPress?: () => void}> = ({
  children,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      activeOpacity={1}
      // style={[styles.inputBoxInput, styles.selectBox]}>
      style={style}>
      <Text style={{fontSize: 16, textAlign: 'center', color: '#FFFFFF'}}>{children}</Text>
    </TouchableOpacity>
  );
};
const Footer: React.FC<{children: JSX.Element}> = ({children}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
      }}>
      {children}
    </View>
  );
};

function EnvTitle() {
  const envStyles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    line: {
      borderTopColor: '#F1F1F1',
      borderTopWidth: 1,
      height: 0,
      width: 113,
    },
    text: {paddingHorizontal: 11, fontSize: 13, color: '#AFB6BE'},
    tips: {
      width: 14,
      height: 14,
    },
  });
  return (
    <View style={envStyles.container}>
      <Text style={envStyles.line}></Text>
      <Text style={envStyles.text}>
        {i18n.t('roomkit_quick_join_access_env')}{' '}
        <Image style={envStyles.tips} source={require('../assets/image/tips.png')}></Image>
      </Text>
      <Text style={envStyles.line}></Text>
    </View>
  );
}

function EnvChooseButton() {
  const envStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    button: {paddingVertical: 0, paddingHorizontal: 0},
    leftButton: {
      paddingRight: 60,
    },
  });
  const [value, setValue] = React.useState('first');

  return (
    <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
      <View style={envStyles.container}>
        <RadioButton.Item
          color="#3456F6"
          style={[envStyles.leftButton, envStyles.button]}
          labelStyle={{fontSize: 14}}
          position="leading"
          label={i18n.t(ENV.CHINA)}
          value={i18n.t(ENV.CHINA)}
        />
        <RadioButton.Item
          color="#3456F6"
          style={envStyles.button}
          labelStyle={{fontSize: 14}}
          position="leading"
          label={i18n.t(ENV.INTERNATIONAL)}
          value={i18n.t(ENV.INTERNATIONAL)}
        />
      </View>
    </RadioButton.Group>
  );
}

const SelectBoxMemo = memo(SelectBox);
const InputBoxMemo = memo(InputBox);

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [roomID, setRoomID] = useState('');
  const [userName, setUserName] = useState('');
  const [classType, setClassType] = useState(0);
  const [role, setRole] = useState(0);
  const [env, setEnv] = useState(i18n.t(ENV.CHINA));

  useEffect(() => {
    console.log('mytag i18n.t("hello")', i18n.t('roomkit_hello'));
    console.log('mytag roomID', roomID);
    console.log('mytag userName', userName);
    // console.log('mytag classType', classType);
    // console.log('mytag role', role);
  }, [roomID]);

  // {i18n.t('roomkit_quick_join_select_room_type')}
  return (
    <View style={styles.container}>
      <SettingBtn navigation={navigation}></SettingBtn>
      <Logo></Logo>
      <InputBoxMemo
        placeholder={i18n.t('roomkit_quick_join_input_id')}
        onChangeText={useCallback((text: string) => setRoomID(text), [])}
      />
      <InputBoxMemo
        placeholder={i18n.t('roomkit_quick_join_input_nickname')}
        onChangeText={useCallback((text: string) => setUserName(text), [])}
      />
      <SelectBoxMemo
        placeholder={i18n.t('roomkit_quick_join_select_room_type')}
        list={{
          title: i18n.t('roomkit_room_schedule_type_web'),
          items: [i18n.t('roomkit_schedule_1v1'), i18n.t('roomkit_schedule_small_class'), i18n.t('roomkit_schedule_large_class')],
        }}
        onSelected={useCallback((selectedItem: string, index: number) => {
          setClassType(index);
        }, [])}
      />
      <SelectBoxMemo
        placeholder={i18n.t('roomkit_quick_join_select_role')}
        list={{
          title: i18n.t('roomkit_quick_join_select_role'),
          items: [
            i18n.t('roomkit_quick_join_select_role_attendee'),
            i18n.t('roomkit_quick_join_select_role_assistant'),
            i18n.t('roomkit_quick_join_select_role_host'),
          ],
        }}
        onSelected={useCallback((selectedItem: string, index: number) => {
          setRole(index);
        }, [])}
      />
      <TouchableButton
        style={styles.joinClass}
        onPress={() => {
          console.log('mytag 快速加入课堂!!!! ');
          navigation.push('Details');
        }}>
        {i18n.t('roomkit_quick_join_room')}
      </TouchableButton>
      <Text
        style={styles.createClass}
        onPress={() => {
          navigation.push('Schedule');
        }}>
        {i18n.t('roomkit_create_room')}
      </Text>
      <Footer>
        <View>
          <EnvTitle></EnvTitle>
          <EnvChooseButton></EnvChooseButton>
        </View>
      </Footer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    height: '100%',
  },

  joinClass: {
    backgroundColor: '#2953FF',
    borderRadius: 6,
    paddingVertical: 16,
    marginTop: 21,
    marginHorizontal: 30,
  },
  createClass: {
    textAlign: 'center',
    color: '#2953FF',
    marginTop: 25,
    fontSize: 15,
  },
});

export default App;
