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

import React, {type PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AuthPage from './pages/AuthPage';
import IndexInput from './pages/IndexInput';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({}) => {
  return (
    <View style={styles.sectionContainer}>
      <IndexInput />
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={backgroundStyle}>
      <Section title="Step One11" />
    </View>
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
