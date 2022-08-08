/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-03 11:30:55
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-05 18:56:47
 * @FilePath: /grett/zego_roomkit_reactnative_sdk/example/src/pages/IndexInput.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react';
import {getDeviceID, initSDK} from 'zego_roomkit_reactnative_sdk';
import {View, Text, Image, StyleSheet} from 'react-native';
import InputBox from '../components/InputBox';
class IndexInput extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  async componentDidMount() {}
  render() {
    return (
      <View>
        <Text>Some Text</Text>
        <View style={styles.roomkitTitle}>
          <Image
            source={{
              uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
            }}
            style={styles.roomkitImage}
          />
          <Text style={styles.roomkitText}> RoomKit </Text>
        </View>
        <InputBox />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  roomkitTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  roomkitText: {
    height: 50,
    fontSize: 30,
    lineHeight: 50,
    fontWeight: '600',
    color: '#303030',
    float: 'left',
  },
  roomkitImage: {
    height: 50,
    width: 50,
    float: 'left',
  },
});
export default IndexInput;
