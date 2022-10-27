import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, StyleSheet, Text, View, Image, TouchableOpacity, Modal} from 'react-native';
import {Env} from '../../../config';
import {SelectModalList, SelectItem} from '../../../types/types';
import i18n from 'i18n-js';

export const ArrowButton: React.FC<{
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

  console.log('mytag re-render in setting com', children);
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
            source={require('../../../assets/image/right_arrow.png')}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const ArrowButtonMemo = memo(ArrowButton);
export const EnvSelectButton: React.FC<{
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
      <ArrowButtonMemo
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        rightContext={selectedContent}>
        {i18n.t('roomkit_quick_join_access_env')}
      </ArrowButtonMemo>
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

export const LogoutComfirmButton: React.FC<{
  onSelected: (selectedItem: string, index: number) => void;
  disabled?: boolean;
}> = ({onSelected, disabled}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <ArrowButtonMemo
        disabled={disabled}
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        needArrow={false}
        isCenterLayout={true}
        fontStyle={{color: '#F54326'}}>
        {i18n.t('roomkit_setting_logout')}
      </ArrowButtonMemo>
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
                  setModalVisible(false);
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
