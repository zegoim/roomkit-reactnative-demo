import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const NavigationHeader: React.FC<{title: string; navigation: any}> = ({title, navigation}) => {
  const headerStyle = StyleSheet.create({
    container: {
      height: 44,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backArrow: {
      position: 'absolute',
      left: 15,
      padding: 5,
    },
  });
  return (
    <View style={headerStyle.container}>
      <TouchableOpacity
        style={headerStyle.backArrow}
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={1}>
        <Image style={{width: 18, height: 18}} source={require('../assets/image/back_arrow.png')}></Image>
      </TouchableOpacity>
      <Text style={{fontSize: 17, color: '#040404'}}>{title}</Text>
    </View>
  );
};

export default NavigationHeader;
