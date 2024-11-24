import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState,useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from '@firebase/firestore';
import { db } from "../Firestore"; // ระบุตำแหน่งของ Firebase.js ที่คุณบันทึกไว้

export default function Register({ navigation }) {
  const [userName, getUserName] = useState('');
  const [email, getEmail] = useState('');
  const [password, getPassword] = useState('');
  const [confirmpassword, getConfirmPassword] = useState('');
  const auth = getAuth(); // Get Firebase Authentication instance

  async function Userregister() {
    if (password !== confirmpassword) {
      alert('รหัสผ่านและรหัสยืนยันไม่ตรงกัน');
      return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // เพิ่ม username ลงใน Firestore
        const userDocRef = doc(collection(db, 'users'), user.uid);
        await setDoc(userDocRef, {
            username: userName,
            Mygames: [],
        });
        alert('สร้างบัญชีผู้ใช้สำเร็จ');
        getUserName('');
        getEmail('');
        getPassword('');
        getConfirmPassword('');
        navigation.navigate('Login');
    } catch (error) {
        console.log(error);
        alert('ชื่ออีเมลนี้ใช้ไม่ได้ กรุณาเปลี่ยนชื่ออีเมล');
    }
}


  return (
    <View style={styles.BodyG}>
      <View style={{ marginTop: 100 }}>
        <Image style={{ height: 100, width: 100 }} source={require('../pic/RCG.png')} />
      </View>
      <Text style={styles.Body1Text}>สมัครสมาชิก</Text>
      <TextInput
        value={userName}
        onChangeText={(userName) => getUserName(userName)}
        placeholder={'UserName'}
        style={styles.Box}
      />
      <TextInput
        value={email}
        onChangeText={(email) => getEmail(email)}
        placeholder={'Email'}
        style={styles.Box}
      />
      <TextInput
        value={password}
        onChangeText={(password) => getPassword(password)}
        placeholder={'Password'}
        secureTextEntry
        style={styles.Box}
      />
      <TextInput
        value={confirmpassword}
        onChangeText={(confirmpassword) => getConfirmPassword(confirmpassword)}
        placeholder={'Confirmpassword'}
        secureTextEntry
        style={styles.Box}
      />
      <View style={styles.BodyBox2}>
        <TouchableOpacity onPress={()=> Userregister()}>
          <Text style={{ backgroundColor: '#446096', color: '#FFFFFF', height: 25, width: 150, textAlign: 'center', fontSize: 15, marginTop: 20 }}>
            สมัครสมาชิก
          </Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ backgroundColor: '#2F2E34', color: '#FFFFFF', height: 20, width: 100, textAlign: 'center', fontSize: 15 }}>
            ย้อนกลับ
          </Text>
        </TouchableOpacity>
      </View>
    </View >

  );
}

const styles = StyleSheet.create({
  BodyG: {
    flex: 1,
    backgroundColor: '#2F2E34',
    height: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  Body1: {
    flex: 5,
    justifyContent: 'center',
    backgroundColor: '#8E8C8C',
  },
  BodyImg: {
    justifyContent: 'center',
    backgroundColor: '#2F2E34',
    alignItems: 'center'
  },
  Body1Text: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 25
  },
  Body2: {
    flex: 7,
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  BodyBox1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2F2E34',

    alignItems: 'center'
  },
  BodyBox2: {
    justifyContent: 'center',
    backgroundColor: '#2F2E34',

    alignItems: 'center'
  },
  Box: {
    marginTop: 10,
    width: 250,
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
    textAlign: 'center'
  }

});
