import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, TextInput, Modal, KeyboardTypeOptions, SafeAreaView } from 'react-native';
import i18n from 'i18n-js';
import { SelectModalList, SelectItem } from '../../../types/types';
import { Env } from '../../../config';
import RadioGroup from 'react-native-radio-buttons-group';


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

export const SettingBtn: React.FC<{ navigation: any }> = ({ navigation }) => {
  const settingStyle = StyleSheet.create({
    settingBtnText: {
      fontSize: 18,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
  });
  return (
    <View style={{ alignItems: 'flex-end' }}>
      <Text
        onPress={() => {
          navigation.push('Setting');
          console.log('touch setting');
        }}
        style={settingStyle.settingBtnText}>
        {i18n.t('roomkit_setting')}
      </Text>
    </View>
  );
};

export const InputBox: React.FC<{
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  value?: string;
  onChangeText?: (text: string) => void
}> = ({
  placeholder,
  keyboardType,
  maxLength,
  value,
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
        paddingVertical: 12,

      },
    });
    console.log('input box has rerender', placeholder);
    return (
      <View style={[inputBoxStyle.inputBox]}>
        <TextInput
          style={inputBoxStyle.inputBoxInput}
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText ? onChangeText : () => { }}
        />
      </View>
    );
  };

export const SelectBox: React.FC<{
  placeholder: string;
  list: SelectModalList;
  onSelected: (selectedItem: SelectItem, index: number) => void;
}> = ({ placeholder, list, onSelected }) => {
  const seletBoxStyle = StyleSheet.create({
    inputBox: {
      marginHorizontal: 30,
      marginBottom: 14,
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVal, setSelectedVal] = useState(0);
  const [selectedContent, setSelectedContent] = useState('');

  console.log('list', list)

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
          console.log('touch input toggle');
          setModalVisible(!modalVisible);
        }}
        activeOpacity={1}
        style={[inputStyle.inputBoxInput, inputStyle.selectBox, { alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: selectedVal ? '#0F0F0F' : '#868CA0' }}>
          {selectedVal ? selectedContent : placeholder}
        </Text>
        <Image
          style={{ width: 12, height: 12 }}
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
          console.log('Modal has been closed.');
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            console.log('touch modal toggle');
            setModalVisible(!modalVisible);
          }}
          style={modalStyle.modalContainer}>
          <View style={modalStyle.modalView}>
            <Text style={[modalStyle.modalRow, modalStyle.modalHeader]}>{list && list.title}</Text>
            {list.items.map((item: SelectItem, index: number) => (
              <Text
                onPress={() => {
                  onSelected(item, index);
                  setSelectedVal(item.value);
                  setSelectedContent(item.content);
                  setModalVisible(false);
                }}
                key={index}
                style={[modalStyle.modalRow, item.value === selectedVal ? { color: '#2953FF' } : {}]}>
                {item.content}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
};

export const Footer: React.FC<{ children: JSX.Element }> = ({ children }) => {
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
      // borderTopColor: '#F1F1F1',
      // borderTopWidth: 1,
      height: 1,
      width: 113,
      backgroundColor: "#F1F1F1"
    },
    text: {
      marginLeft: 11,
      fontSize: 13,
      color: '#AFB6BE'
    },
  });
  return (
    <View style={envStyles.container}>
      <Text style={envStyles.line} />
      <Text style={envStyles.text}>
        {i18n.t('roomkit_quick_join_access_env')}{' '}
      </Text>
      <EnvTipsButton></EnvTipsButton>
      <Text style={envStyles.line} />
    </View>
  );
};


const EnvTipsButton: React.FC<{
}> = ({ }) => {
  const headerStyle = StyleSheet.create({
    text: {
      fontSize: 16,
      color: '#040404',
      padding: 5,
    },
    rightTitle: {
      color: '#2953FF',
    },
    tips: {
      width: 14,
      height: 14,
      marginRight: 11,
      marginTop: 2,
      padding: 3
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => {
        setModalVisible(true);
      }} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}>
        <Image style={headerStyle.tips} source={require('../../../assets/image/tips.png')} />
      </TouchableWithoutFeedback>
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
        position: 'relative',
        bottom: 80,
        left: 30,
        right: 30,
        borderRadius: 6,
        overflow: "hidden"
      },
      modalRow: {
        maxWidth: 330,
        padding: 10,
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        backgroundColor: 'rgba(1,1,1,0.8)',
      },
    });
    
    return (
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={modalStyle.modalContainer}>
            <View style={[modalStyle.modalView]}>
              <Text style={modalStyle.modalRow}>{i18n.t("roomkit_quick_join_access_env_tips")}</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }
};


export const EnvChooseButton: React.FC<{ envValue: Env; onChoose: (env: number) => void }> = ({
  envValue,
  onChoose,
}) => {
  const envStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    button: { paddingVertical: 0, paddingHorizontal: 0 },
    leftButton: {
      paddingRight: 30,
    },
  });
  const radioButtonsData = [{
    id: String(Env.MainLand), // acts as primary key, should be unique and non-empty string
    label: i18n.t(ENV_VAL.CHINA),
    color: "#3456F6",
    size: 18,
    labelStyle: envStyles.leftButton,
    selected: envValue === Env.MainLand ? true : false, // 初始化的值
    onPress: onPressRadioButton,

  }, {
    id: String(Env.OverSeas),
    label: i18n.t(ENV_VAL.INTERNATIONAL),
    size: 18,
    color: "#3456F6",
    selected: envValue === Env.OverSeas ? true : false,
    onPress: onPressRadioButton,
  }]
  const [radioButtons, setRadioButtons] = useState(radioButtonsData)
  useEffect(() => {
    setRadioButtons(radioButtonsData)
  }, [envValue])

  function onPressRadioButton(value: any) {
    const selectedRadio = radioButtonsData.find(item => item.selected === true)
    // 同步全局的环境值
    onChoose(Number(selectedRadio?.id));
  }

  function onPressRadioButtonGroup(radioButtonsArray: any) {
    setRadioButtons(radioButtonsArray);
  }
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={onPressRadioButtonGroup}
        layout='row'
      />
    </View>
  );
};
