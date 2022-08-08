/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-03 11:30:55
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-08 10:00:55
 * @FilePath: /grett/zego_roomkit_reactnative_sdk/example/src/pages/authPage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import ZegoRoomkitSdk from 'zego_roomkit_reactnative_sdk';
import {View, Text, StyleSheet, TextInput} from 'react-native';
class InputBox extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {deviceid: ''};
    ZegoRoomkitSdk.init({
      secretID: 1000001,
    });
  }
  async componentDidMount() {
    let id = await ZegoRoomkitSdk.instance.getDeviceID();
    this.setState({
      deviceid: id,
    });
  }
  render() {
    return (
      <View>
        <TextInput
          style={styles.inputContainer}
          defaultValue="please input roomID"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    color: '#8D8C94',
  },
});

export default InputBox;
