import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../Firestore'; // Import your Firebase authentication instance
import { doc, getDoc } from '@firebase/firestore';
import { db } from "../Firestore"; // Assuming db is your Firestore instance
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../Firestore'; // Use compat to access legacy namespaced library
import 'firebase/compat/storage';
import { ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from "firebase/storage";
import { updateDoc } from 'firebase/firestore';

export default function Setting({ navigation }) {
  const [userData, setUserData] = useState({
    uid: '',
    name: '',
    email: '',
    picPF: '',
  });
  const storageRef = ref(storage, 'gs://rcg-game.appspot.com/ProfileImage');
  const [editedUsername, setEditedUsername] = useState(userData ? userData.username : '');

  async function askPer() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(status);
    if (status !== "granted")
      alert('Permission not granted to access the media library.');
  };

  useEffect(() => {
    askPer();
  }, []);

  useEffect(() => {
    if (userData) {
      loadImg();
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userData = {
          uid: user.uid,
          name: user.username,
          email: user.email,
          picPF: user.photoURL,
        };

        try {
          const userDoc = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDoc);

          if (userDocSnap.exists()) {
            const userDataFromFirestore = userDocSnap.data();
            setUserData({ ...userData, ...userDataFromFirestore });
          } else {
            console.log('User data not found in Firestore.');
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      } else {
        console.log('User not logged in.');
      }
    };

    fetchData();
  }, []);

  async function getImage() {
    if (userData) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          console.log('Image URI:', imageUri);

          try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const filename = `IMG_${userData.uid}_picPF.jpg`;
            const imgRef = ref(storageRef, filename);

            await uploadBytes(imgRef, blob);
            console.log('Uploaded!!!');

          } catch (error) {
            console.error('Error fetching or uploading the image:', error);
          }
        }
      } catch (error) {
        console.error('Error picking the image:', error);
      }
    } else {
      console.error('userData is null. Cannot pick image.');
    }
  }

  async function loadImg() {
    if (userData) {
      const filename = `IMG_${userData.uid}_picPF.jpg`;
      const imgRef = ref(storageRef, filename);

      try {
        const url = await getDownloadURL(imgRef);

        const userDoc = doc(db, 'users', userData.uid); // แนะนำให้ใช้ uid เพื่อระบุเอกสารของผู้ใช้ที่ต้องการอัปเดต
        await updateDoc(userDoc, {
          picPF: url // อัปเดตลิ้งค์ download URL ในฐานข้อมูลของผู้ใช้
        });

        // อัปเดตค่า userData ด้วย URL ใหม่
        setUserData(prevUserData => ({
          ...prevUserData,
          picPF: url
        }));

      } catch (error) {
      }
    } else {
      console.error('userData is null. Cannot load image.');
    }
  };

  async function saveUsername() {
    if (userData) {
      try {
        const userDoc = doc(db, 'users', userData.uid);

        // Update the 'username' field in Firestore
        await updateDoc(userDoc, {
          username: editedUsername,
        });

        // Update the local 'userData' with the new username
        setUserData((prevUserData) => ({
          ...prevUserData,
          username: editedUsername,
        }));

        // Optionally, you can show a success message or perform any other necessary actions.
        console.log('Username updated successfully.');
      } catch (error) {
        console.error('Error updating username:', error);
        // Handle the error (e.g., display an error message to the user).
      }
    } else {
      console.error('userData is null. Cannot update username.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileUI}>
        <View style={styles.profileHeader}>
          {userData ? (
            <TouchableOpacity title="Image" onPress={() => getImage()}>
              <Image
                style={styles.profile}
                source={{
                  uri: userData.picPF ? userData.picPF : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }}
              />
            </TouchableOpacity>
          ) : (
            <Text>Loading...</Text>
          )}
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: -20, color: 'white' }}>{userData ? userData.username : 'Loading...'}</Text>
          <Text style={{ fontSize: 18, color: 'white' }}>{userData ? userData.email : 'Loading...'}</Text>
        </View>
        <View style={styles.menu}>
          <Text style={{ color: 'white' }}>New Name</Text>
          <TextInput
            style={{ color: '#FFFFFF' }} 
            placeholder="Enter Your Name"
            placeholderTextColor="gray"
            value={editedUsername}
            onChangeText={(text) => setEditedUsername(text)}
          />
          <View style={{ flexDirection: "row", width: "100%", justifyContent: 'space-around', marginTop: 30 }}>
            <TouchableOpacity style={styles.btn} onPress={saveUsername}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 30,
    width: 100,
    backgroundColor: "lightgreen",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btn2: {
    height: 30,
    width: 100,
    backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  menu: {
    flex: 7,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: "100%",
    marginLeft:10,
  },
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  profileUI: {
    flex: 1,
    width: "100%",
    marginTop: 50,
  },
  profileHeader: {
    flex: 3,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 100,
  },
});
