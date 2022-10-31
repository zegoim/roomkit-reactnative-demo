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

import React, { useEffect, useReducer, useContext, createContext, } from 'react';
import { I18nManager, StatusBar, SafeAreaView, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import Spinner from 'react-native-loading-spinner-overlay';

import { RoomkitProvider } from './context/roomkitContext';

import Login from './pages/Login/index';
import Setting from './pages/Setting/index';
import RoomSetting from './pages/RoomSetting';
import CustomUI from './pages/CustomUI/index';
import Schedule from './pages/Schedule/index';
import Classroom from './pages/Classroom/index';
import { toastConfig } from './utils/CustomToast';
import { useState } from 'react';
import { initRoomkit } from './api/roomkitApi';

export const LoadingContext = createContext({});

const translationGetters = {
  // lazy requires
  zh: () => require('./assets/translations/zh.json'),
  en: () => require('./assets/translations/en.json'),
};


ErrorUtils.setGlobalHandler(error => {
  console.log('ErrorUtils发现了语法错误，避免了崩溃，具体报错信息：');
  console.log("errorNname: " ,error.name + ", ", "errorMessage : " , error.message, [{ text: 'OK' }]);
  Toast.show({ text1: error.message, type: 'error' });
});

const setI18nConfig = () => {
  // 如果没有可用的语言则回退到中文
  const fallback = { languageTag: 'zh', isRTL: false };
  // 获取 最佳语言标签及其阅读方向
  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
  // 设置语言方向
  I18nManager.forceRTL(isRTL);
  // 当前的语言包
  i18n.translations = {
    // @ts-ignore
    [languageTag]: translationGetters[languageTag](),
  };
  i18n.locale = languageTag;
};

const Stack = createNativeStackNavigator();


const App = () => {
  // 初始化 i18n
  useState(() => setI18nConfig());
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
    initRoomkit()
    RNLocalize.addEventListener('change', handleLocalizationChange);
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);
  const [spinner,setSpinner] = useState(false)

  const handleLocalizationChange = (e: any) => {
    console.log('mytag locallisze change e', e);
    setI18nConfig();
    forceUpdate();
  };

  const screens = [
    {
      name: 'Login',
      options: {
        headerShown: false,
      },
      component: Login,
    },
    {
      name: 'RoomSetting',
      options: {
        headerShown: false,
      },
      component: RoomSetting,
    },
    {
      name: 'Schedule',
      options: {
        headerShown: false,
      },
      component: Schedule,
    },
    {
      name: 'Classroom',
      options: {
        headerShown: false,
      },
      component: Classroom,
    },
    {
      name: 'Setting',
      options: {
        headerShown: false,
      },
      component: Setting,
    },
    {
      name: 'CustomUI',
      options: {
        headerShown: false,
      },
      component: CustomUI,
    },
    // {
    //   name: 'Details',
    //   options: {
    //     headerShown: false,
    //   },
    //   component: DetailsScreen,
    // },
  ];

  return (
    <>
      <RoomkitProvider>
        <LoadingContext.Provider value={{spinner,setSpinner}}>
          <SafeAreaView style={{ flex: 1 }}>
            <Spinner
              visible={spinner}
              textContent={'Loading...'}
              textStyle={{ color: '#FFF' }}
            />
            <NavigationContainer>
              <StatusBar backgroundColor="white" barStyle="dark-content" />
              <Stack.Navigator>
                {screens.map(screenItem => {
                  return (
                    <Stack.Screen
                      key={screenItem.name}
                      name={screenItem.name}
                      options={{ ...screenItem.options }}
                      component={screenItem.component}
                    />
                  );
                })}
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </LoadingContext.Provider>

      </RoomkitProvider>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;
