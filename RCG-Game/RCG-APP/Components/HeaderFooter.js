import { StyleSheet, View, Text,Image,TouchableOpacity, } from 'react-native';
import React, { useState } from 'react';


export function Header() {
  return (
    <View style={{...styles.header,...styles.shadow2}}>
       <View style={[styles.header,{ flexDirection: 'row' }]}>
        <Image source={require('../pic/RCG.png')} style={{width: 60,height: 50,}} />
      </View>
      <Text style={{...styles.headerText,...styles.shadow}}>DDDDD</Text>
    </View>
  );
}

export function Footer({setFeed}) {
  return (
    <View style={[styles.footer, { flexDirection: 'row' }]}>
      <TouchableOpacity onPress={() => setFeed('RECOMMENDGAMES')} style={styles.footerImage} >
      <Image source={require('../pic/Home.png')} style={{...styles.footerImage,...styles.image}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFeed('GAME ARCHIVE')} style={styles.footerImage}>
      <Image source={require('../pic/Game.png')} style={{...styles.footerImage, width: 47,height: 30,}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFeed('MyGame')} style={styles.footerImage}>
      <Image source={require('../pic/Love.png')} style={{...styles.footerImage,...styles.image}} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFeed('USER PROFILE')} style={styles.footerImage}>
      <Image source={require('../pic/Profile.png')} style={{...styles.footerImage,...styles.image}} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#444',
    padding: 10,
    alignItems: 'center', // จัดให้องค์ประกอบตรงกลางแนวตั้ง
    flexDirection: 'row', // จัดเรียงแนวนอน
    
  },
  headerText: {
    color: 'white',
    fontSize: 20,

  },
  footer: {
    backgroundColor: '#444',
    padding: 10,
    alignItems: 'center',
    marginTop:0,
    
  },
  footerText: {
    color: 'white',
    fontSize: 16,
  },
  HeaderImage: {
    marginLeft: 'auto',
    marginRight: 'auto', // ระยะห่างระหว่างข้อความและรูปภาพ
  },
  footerImage: {
    marginLeft: 'auto',
    marginRight: 'auto', // ระยะห่างระหว่างข้อความและรูปภาพ
  },
  imageWithShadow: {
    shadowColor: 'red', // สีของเงา
    shadowOffset: { width: 3, height: 3 }, // ขนาดและตำแหน่งเงา
    shadowOpacity: 0.5, // ความโปร่งแสงของเงา (ระหว่าง 0 ถึง 1)
    shadowRadius: 1, // รัศมีของเงา
  },
  image: {
    width: 35,
    height: 30,
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
   },
   shadow2: {
    shadowColor: 'black', // สีของเงา
    shadowOffset: { width: 2, height: 2 }, // ขนาดและตำแหน่งเงา
    shadowOpacity: 0.5, // ความโปร่งแสงของเงา
    shadowRadius: 5, // รัศมีของเงา
    elevation: 5, // (ใช้สำหรับ Android) ความลึกของเงา
   },
});
