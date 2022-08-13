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

interface SelectModalList {
  title: string;
  items: string[];
}

const TouchableButton: React.FC<{
  children: string;
  needArrow?: boolean;
  style?: Object;
  fontStyle?: Object;
  customRight?: string;
  isCenterLayout?: boolean;
  onPress?: () => void;
}> = ({children, needArrow = true, style, fontStyle, customRight, isCenterLayout = false, onPress}) => {
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
  });

  console.log('mytag re-render');
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
      }}
      activeOpacity={1}
      style={[buttonStyle.container, style]}>
      <Text style={[buttonStyle.left, fontStyle]}>{children}</Text>
      <View style={buttonStyle.right}>
        {!!customRight && <Text style={{fontSize: 14}}>{customRight}</Text>}
        {!!needArrow && (
          <Image style={{width: 14, height: 14}} source={require('../assets/image/right_arrow.png')}></Image>
        )}
      </View>
    </TouchableOpacity>
  );
};

const EnvSelectButton: React.FC<{
  list: SelectModalList;
  onSelected: (selectedItem: string, index: number) => void;
}> = ({list, onSelected}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(i18n.t('quick_join_domestic_env'));
  return (
    <View>
      <TouchableButton
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        customRight={selectedItem}>
        {i18n.t('quick_join_access_env')}
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

const LogoutComfirmButton: React.FC<{onSelected: (selectedItem: string, index: number) => void}> = ({onSelected}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(i18n.t('quick_join_domestic_env'));
  return (
    <View>
      <TouchableButton
        onPress={useCallback(() => {
          setModalVisible(true);
        }, [])}
        needArrow={false}
        isCenterLayout={true}
        fontStyle={{color: '#F54326'}}>
        {i18n.t('logout')}
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
      <Modal
        animationType="fade"
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
            <View style={[modalStyle.modalRow]}>
              <Text style={[modalStyle.text, modalStyle.modalHeader]}>{i18n.t('logout_desc')}</Text>
              <Text
                onPress={() => {
                  console.log('mytag touch confirm');
                }}
                style={[modalStyle.text, {color: '#F54326'}]}>
                {i18n.t('confirm')}
              </Text>
            </View>
            <View style={[modalStyle.modalRow]}>
              <Text
                onPress={() => {
                  console.log('mytag touch cancel');
                }}
                style={[modalStyle.text]}>
                {i18n.t('cancel')}
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

const TouchableButtonMemo = memo(TouchableButton);

const App: React.FC<{navigation: any}> = ({navigation}) => {
  const [envItem, setEnvItem] = useState(i18n.t('quick_join_domestic_env'));
  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      <NavigationHeader navigation={navigation} title={i18n.t('setting')}></NavigationHeader>
      <TouchableButtonMemo onPress={useCallback(() =>{
        console.log('mytag touch here', )
        navigation.push("RoomSetting")
      },[])} style={styles.mgt10}>{i18n.t('room_setting')}</TouchableButtonMemo>
      <TouchableButtonMemo>{i18n.t('custom_UI')}</TouchableButtonMemo>
      <EnvSelectButton
        list={{
          title: i18n.t('quick_join_access_env'),
          items: [i18n.t('quick_join_domestic_env'), i18n.t('quick_join_overseas_env')],
        }}
        onSelected={useCallback((selectedItem: string, index: number) => {
          setEnvItem(selectedItem);
        }, [])}></EnvSelectButton>
      <TouchableButtonMemo needArrow={false} customRight={'v1.1.1'}>
        {i18n.t('version')}
      </TouchableButtonMemo>
      <TouchableButtonMemo style={styles.mgt10}>{i18n.t('feedback')}</TouchableButtonMemo>
      <TouchableButtonMemo>{i18n.t('upload_log')}</TouchableButtonMemo>
      <TouchableButtonMemo style={styles.mgt10} needArrow={false} isCenterLayout={true}>
        {i18n.t('delete_account')}
      </TouchableButtonMemo>

      <LogoutComfirmButton
        onSelected={useCallback((selectedItem: string, index: number) => {
          // logout todo
          // setEnvItem(selectedItem);
        }, [])}></LogoutComfirmButton>
      {/* <TouchableButtonMemo needArrow={false} isCenterLayout={true} fontStyle={{color: '#F54326'}}>
        {i18n.t('logout')}
      </TouchableButtonMemo> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mgt10: {
    marginTop: 10,
  },
});

export default App;
