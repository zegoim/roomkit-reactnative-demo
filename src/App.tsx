/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-03 17:12:22
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-05 18:48:37
 * @FilePath: /grett/roomkit_reactnative_demo/src/App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, type PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View, Button, I18nManager, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import IndexInput from './pages/IndexInput';
import Login from './pages/Login';
import Setting from './pages/Setting';
import RoomSetting from './pages/RoomSetting';
import CustomUI from './pages/CustomUI';
import Schedule from './pages/Schedule';

const translationGetters = {
  // lazy requires
  zh: () => require('./assets/translations/zh.json'),
  en: () => require('./assets/translations/en.json'),
};

// 缓存
// const translate = memoize(
//   (key, config) => i18n.t(key, config),
//   (key, config) => (config ? key + JSON.stringify(config) : key),
// );

const setI18nConfig = () => {
  // 如果没有可用的语言则回退到中文
  const fallback = {languageTag: 'zh', isRTL: false};
  // 获取 最佳语言标签及其阅读方向
  const {languageTag, isRTL} = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
  // 设置语言方向
  I18nManager.forceRTL(isRTL);
  // 当前的语言包
  i18n.translations = {
    // @ts-ignore
    [languageTag]: translationGetters[languageTag](),
  };
  i18n.locale = languageTag;
};

const DetailsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Text>{i18n.t('hello')}</Text>
      <Button title="Go to Details... again" onPress={() => navigation.push('Details')} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const Stack = createNativeStackNavigator();
const App = () => {
  // 要在 created 阶段设置。 如果在 didmount 阶段就太晚了。
  setI18nConfig();
  useEffect(() => {
    console.log('mytag APP.tsx componentDidMount ');
    RNLocalize.addEventListener('change', handleLocalizationChange);
    return () => {
      console.log('mytag APP.tsx componentWillUnmount ');
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  const screens = [
    {
      name: 'Schedule',
      options: {
        headerShown: false,
      },
      component: Schedule,
    },
    {
      name: 'Login',
      options: {
        headerShown: false,
      },
      component: Login,
    },

    {
      name: 'Setting',
      options: {
        headerShown: false,
      },
      component: Setting,
    },
    {
      name: 'RoomSetting',
      options: {
        headerShown: false,
      },
      component: RoomSetting,
    },
    {
      name: 'CustomUI',
      options: {
        headerShown: false,
      },
      component: CustomUI,
    },
    {
      name: 'Details',
      options: {
        headerShown: false,
      },
      component: DetailsScreen,
    },
  ];

  const handleLocalizationChange = () => {
    setI18nConfig();
  };
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Navigator>
        {screens.map((screenItem, index) => {
          return (
            <Stack.Screen
              key={screenItem.name}
              name={screenItem.name}
              options={{...screenItem.options}}
              component={screenItem.component}></Stack.Screen>
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
