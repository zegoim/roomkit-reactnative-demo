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
import {getUid, getPid} from '../utils/utils';
import {ClassType, Env} from '../utils/config';
import i18n from 'i18n-js';

interface SelectModalList {
  title: string;
  items: string[];
}
type textFunction = (text: string) => void;

const ENV_VAL = {
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

const InputBox: React.FC<{placeholder: string; onChangeText?: textFunction}> = ({
  placeholder,
  onChangeText,
}) => {
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
  console.log('mytag re-render', placeholder);
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
        <Image
          style={{width: 12, height: 12}}
          source={require('../assets/image/down_arrow.png')}></Image>
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
  const [value, setValue] = React.useState(i18n.t(ENV_VAL.CHINA));

  return (
    <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
      <View style={envStyles.container}>
        <RadioButton.Item
          color="#3456F6"
          style={[envStyles.leftButton, envStyles.button]}
          labelStyle={{fontSize: 14}}
          position="leading"
          label={i18n.t(ENV_VAL.CHINA)}
          value={i18n.t(ENV_VAL.CHINA)}
        />
        <RadioButton.Item
          color="#3456F6"
          style={envStyles.button}
          labelStyle={{fontSize: 14}}
          position="leading"
          label={i18n.t(ENV_VAL.INTERNATIONAL)}
          value={i18n.t(ENV_VAL.INTERNATIONAL)}
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
  const [classType, setClassType] = useState("0");
  const [role, setRole] = useState(0);
  const [env, setEnv] = useState(i18n.t(ENV_VAL.CHINA));
  useEffect(() => {
    // console.log('mytag classType', classType);
    // console.log('mytag role', role);
  }, [roomID]);

  const classTypeList = useMemo(() => {
    return {
      title: i18n.t('roomkit_room_schedule_type_web'),
      items: [
        i18n.t('roomkit_schedule_1v1'),
        i18n.t('roomkit_schedule_small_class'),
        i18n.t('roomkit_schedule_large_class'),
      ],
    };
  }, []);
  const roleTypeList = useMemo(() => {
    return {
      title: i18n.t('roomkit_quick_join_select_role'),
      items: [
        i18n.t('roomkit_quick_join_select_role_attendee'),
        i18n.t('roomkit_quick_join_select_role_assistant'),
        i18n.t('roomkit_quick_join_select_role_host'),
      ],
    };
  }, []);
  const setRoomIDFun = useCallback((text: string) => setRoomID(text), []);
  const setUserNameFun = useCallback((text: string) => setUserName(text), []);
  const setClassTypeFun = useCallback((selectedItem: string, index: number) => {
    setClassType(String(index));
  }, []);
  const setRoleTypeFun = useCallback((selectedItem: string, index: number) => {
    setRole(index);
  }, []);

  const classSelectedMap = {
    '0': ClassType.Class_1V1,
    '1': ClassType.CLASS_SMALL,
    '2': ClassType.CLASS_LARGE,
  };
  
  const envSelectedMap = {
    [ENV_VAL.CHINA]: Env.MainLand,
    [ENV_VAL.INTERNATIONAL]: Env.OverSeas,
  };
  const goDetail = useCallback(() => {
    const routeParam = {
      roomID,
      userName,
      userID: getUid(userName),
      pid: getPid(ClassType.Class_1V1, envSelectedMap[env], '123'),
    };
    navigation.push('Details');
  }, []);

  const goSchedule = useCallback(() => {
    navigation.push('Schedule');
  }, []);

  return (
    <View style={styles.container}>
      <SettingBtn navigation={navigation}></SettingBtn>
      <Logo></Logo>
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
      <TouchableButton style={styles.joinClass} onPress={goDetail}>
        {i18n.t('roomkit_quick_join_room')}
      </TouchableButton>
      <Text style={styles.createClass} onPress={goSchedule}>
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
