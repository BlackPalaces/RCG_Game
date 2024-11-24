import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import '@firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs ,onSnapshot} from '@firebase/firestore';
import { db } from "../Firestore"; // ระบุตำแหน่งของ Firebase.js ที่คุณบันทึกไว้

export default function Home({ navigation }) {
  const [NewGame, setNewGame] = useState([]);
  const [AdviceGame, setAdviceGame] = useState([]);
  const [TopRatedGames, setTopRatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const gifUrl = 'https://i.gifer.com/5l03.gif';

  useEffect(() => {
    const GamesCollection = collection(db, 'Games');

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(GamesCollection, (querySnapshot) => {
      const tempGames = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const topRatedGames = tempGames.sort((a, b) => b.Rate - a.Rate).slice(0, 6);
      setTopRatedGames(topRatedGames);

      const adviceGames = tempGames.filter((game) => game.Status === 'ADVICE').slice(0, 6);
      setAdviceGame(adviceGames);

      const newGames = tempGames.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).slice(0,6);
      setNewGame(newGames);

      setLoading(false);
    });

    // Clean up subscription when the component unmounts
    return () => unsubscribe();
  }, []);



  if (loading) {
    // แสดงข้อความ "Loading..."
    return (
      <View style={{ backgroundColor: '#282727', flex: 1, alignContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator style={{ marginTop: 250 }} size={70} color="#ffffff" />
         <Text style={{ marginTop: 5, fontSize: 30, color: '#fff', ...styles.shadow }}>LOADING...</Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.containerview}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View>
        <Text style={styles.font1}>ยินดีต้อนรับ</Text>
        <Text style={{ ...styles.shadow, fontSize: 16, color: 'white', marginLeft: 20 }}>มาดูกันว่าวันนี้เรามีอะไรใหม่ๆมาแนะนำคุณ...</Text>
        <View>
          <Text style={{ fontSize: 24, color: '#C9C212', marginLeft: 20, marginTop: 20, ...styles.shadow }}>ได้รับการโหวตสูง!!</Text>
          <ScrollView style={{ marginTop: 20, overflowY: 'auto' }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {TopRatedGames.map((item, index) => (
              <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
                <Image source={{ uri: item.Pic }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text style={styles.font2}>แนะนำ</Text>
          <ScrollView style={{ marginTop: 20, overflowY: 'auto' }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {AdviceGame.map((item, index) => (
              <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
                <Image source={{ uri: item.Pic }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text style={styles.font2}>เมื่อเร็วๆนี้</Text>
          <ScrollView style={{ marginTop: 20, overflowY: 'auto' }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {NewGame.map((item, index) => (
              <TouchableOpacity key={index} style={{ ...styles.imageContainer, marginBottom: 20, }} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
                <Image source={{ uri: item.Pic }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  font1: {
    color: 'white', // เปลี่ยนเป็น 'blue' และตัวพิมพ์เล็ก
    marginLeft: 10,
    marginTop: 20,
    fontSize: 32,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'left', // จัดตำแหน่งข้อความที่มุมซ้าย
    //textAlignVertical: 'center', // จัดตำแหน่งแนวตั้งกลาง
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  font2: {
    fontSize: 24,
    color: '#ffffff',
    marginLeft: 20,
    marginTop: 20,
    // เพิ่มสไตล์ textShadow 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  imageContainer: {
    width: 300, // ปรับขนาดกล่องภาพตามที่คุณต้องการ
    height: 200, // ปรับขนาดกล่องภาพตามที่คุณต้องการ
    marginHorizontal: 5, // ระยะห่างระหว่างรูปภาพ
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    borderRadius: 10, // ปรับขนาดความโค้งของมุม
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  imageText: {
    color: "white",
    fontSize: 20,
  },
  containerview: {
    flex: 1,
    backgroundColor: '#2F2E34',
  },
});