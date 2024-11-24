import { StyleSheet, Button, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../Firestore'; // Import your Firebase authentication instance
import { doc, getDoc } from '@firebase/firestore';
import { db } from "../Firestore"; // Assuming db is your Firestore instance

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);

  async function Logout() {
    try {
      await auth.signOut();
      navigation.navigate('LoginStack');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  useFocusEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          picPF: user.photoURL,
        };

        try {
          const userDoc = doc(db, 'users', user.uid); // Assuming user ID is stored in Firebase auth
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileUI}>
        <View style={styles.profileHeader}>
          {userData && (
            <Image
              style={styles.profile}
              source={{
                uri: userData && userData.picPF ? userData.picPF : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              }}
            />
          )}
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginTop: -20, color: 'white' }}>{userData ? userData.username : 'Loading...'}</Text>
          <Text style={{ fontSize: 18, color: 'white' }}>{userData ? userData.email : 'Loading...'}</Text>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.setbar} onPress={() => navigation.navigate('Setting')}>
            <Ionicons style={{ fontSize: 24, color: 'white', marginRight: 5 }} name="settings-outline"></Ionicons>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.setbar} onPress={() => Logout()}>
            <Ionicons style={{ fontSize: 24, color: 'white', marginRight: 5 }} name="log-out-outline"></Ionicons>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  menu: {
    flex: 7,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#222",
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
  icon: {
    width: 25,
    height: 25,
    tintColor: 'white'

  },
  setbar: {
    width: "100%",
    backgroundColor: "#555",
    flexDirection: 'row',
    marginTop: 5,
    padding: 10,
  },
});