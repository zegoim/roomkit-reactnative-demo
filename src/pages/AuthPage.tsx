/*
 * @Author: zegobuilder zegobuilder@zego.im
 * @Date: 2022-08-03 11:30:55
 * @LastEditors: zegobuilder zegobuilder@zego.im
 * @LastEditTime: 2022-08-05 11:44:13
 * @FilePath: /grett/zego_roomkit_reactnative_sdk/example/src/pages/authPage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react';
import {getDeviceID, initSDK} from 'zego_roomkit_reactnative_sdk';
import {View, Text} from 'react-native';
class AuthPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {deviceid: ''};
    initSDK({
      secretID: 1000001,
    });
  }
  async componentDidMount() {
    let id = await getDeviceID();
    this.setState({
      deviceid: id,
    });
  }
  render() {
    return (
      <View>
        <Text>deviceid: {this.state.deviceid}</Text>
      </View>
    );
  }
}

export default AuthPage;
