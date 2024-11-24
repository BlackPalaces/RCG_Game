import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { db } from "../Firestore"; // ระบุตำแหน่งของ Firebase.js ที่คุณบันทึกไว้
import { CommonActions } from '@react-navigation/native';




export default function Login({ navigation }) {
  const [email, setEmail] = useState('');

  const auth = getAuth(); // Get Firebase Authentication instance

  async function Forgotpassword() {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('ส่งคำขอสำเร็จ');
    } catch (error) {
      alert(error);
    }
  }

  return (
    <View style={styles.BodyG}>
      <View style={styles.Body1}>
        <View style={styles.Body2}>
          <View style={styles.BodyImg}>
            <Image style={{ height: 100, width: 100 }} source={require('../pic/RCG.png')} />
          </View>
          <Text style={{ ...styles.Body1Text, ...styles.shadow }}>ลืมรหัสผ่าน</Text>
          <TextInput style={styles.Box}
            placeholder="Email"
            onChangeText={text => setEmail(text)}
            value={email}
          />
          <TouchableOpacity onPress={() => Forgotpassword()} style={styles.LoginButton}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 15 }}>
              ส่งคำร้องขอ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ backgroundColor: '#2F2E34', color: '#FFFFFF', height: 20, width: 100, textAlign: 'center', fontSize: 15,marginTop:10 }}>
              ย้อนกลับ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  BodyG: {
    flex: 1,
    backgroundColor: 'black',
  },
  Body1: {
    flex: 1,
    backgroundColor: '#8E8C8C',
  },
  BodyImg: {
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center',
  },
  Body1Text: {
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#2F2E34',
    color: '#FFFFFF',
    fontSize: 25,
  },
  Body2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center',
  },
  BodyBox1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center',
  },
  BodyBox3: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20, // เพิ่ม marginBottom
  },
  BodyBox3: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  Box: {
    marginTop: 10,
    marginBottom: 10,
    width: 250,
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  LoginButton: {
    backgroundColor: '#446096',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    padding: 10,
  },
  SignUpButton: {
    backgroundColor: '#2F2E34',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    padding: 10,
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
