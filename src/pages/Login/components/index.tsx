import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal} from 'react-native';
import i18n from 'i18n-js';
import {SelectModalList, SelectItem} from '../../../types/types';
import {Env} from '../../../utils/config';
import {RadioButton} from 'react-native-paper';
const ENV_VAL = {
  CHINA: 'roomkit_quick_join_access_env_mainland',
  INTERNATIONAL: 'roomkit_quick_join_access_env_overseas',
};

export const Logo: React.FC<{}> = () => {
  const logoStyls = StyleSheet.create({
    loginLogo: {
      marginTop: 20,
      marginLeft: 31,
      width: 127,
      height: 25,
      marginBottom: 39,
    },
  });
  return <Image style={logoStyls.loginLogo} source={require('../../../assets/image/logo.png')} />;
};

export const SettingBtn: React.FC<{navigation: any}> = ({navigation}) => {
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

export const InputBox: React.FC<{placeholder: string; onChangeText?: (text: string) => void}> = ({
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

export const SelectBox: React.FC<{
  placeholder: string;
  list: SelectModalList;
  onSelected: (selectedItem: SelectItem, index: number) => void;
}> = ({placeholder, list, onSelected}) => {
  const seletBoxStyle = StyleSheet.create({
    inputBox: {
      marginHorizontal: 30,
      marginBottom: 14,
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVal, setSelectedVal] = useState(0);
  const [selectedContent, setSelectedContent] = useState('');
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
        <Text style={{fontSize: 16, color: selectedVal ? '#0F0F0F' : '#868CA0'}}>
          {selectedVal ? selectedContent : placeholder}
        </Text>
        <Image
          style={{width: 12, height: 12}}
          source={require('../../../assets/image/down_arrow.png')}></Image>
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

export const Footer: React.FC<{children: JSX.Element}> = ({children}) => {
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

export const EnvTitle: React.FC<{}> = () => {
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
      <Text style={envStyles.line} />
      <Text style={envStyles.text}>
        {i18n.t('roomkit_quick_join_access_env')}{' '}
        {/* <Image style={envStyles.tips} source={require('../../../assets/image/tips.png')} /> */}
      </Text>
      <Text style={envStyles.line} />
    </View>
  );
};

export const EnvChooseButton: React.FC<{envValue: Env; onChoose: (env: number) => void}> = ({
  envValue,
  onChoose,
}) => {
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
  const [radioContent, setRadioContent] = React.useState(i18n.t(ENV_VAL.CHINA));

  useEffect(() => {
    setRadioContent(i18n.t(envValue === Env.MainLand ? ENV_VAL.CHINA : ENV_VAL.INTERNATIONAL));
  }, [envValue]);
  // if(envValue){}
  return (
    <RadioButton.Group
      onValueChange={value => {
        setRadioContent(value);
        onChoose(value === i18n.t(ENV_VAL.CHINA) ? Env.MainLand : Env.OverSeas);
      }}
      value={radioContent}>
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
};
