import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { getDocs, collection, query, where, doc, getDoc } from '@firebase/firestore';
import { db } from '../Firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function MyGame({ navigation }) {
  const [cuser, setCuser] = useState(null);
  const [cgames, setCgames] = useState([]);
  const [idgames, setIdgames] = useState([]);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);

  const MyGame = async () => {
    try {
      const Usergame = doc(db, 'users', cuser);
      const ThisUgame = await getDoc(Usergame);

      if (ThisUgame.exists()) {
        const GameID = ThisUgame.data();
        const myGamesArray = GameID.Mygames.map(game => game.MyGameID);
        setIdgames(myGamesArray);
      } else {
        console.log('ไม่มีข้อมูล');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      await checkLogin();
      if (cuser) {
        await MyGame();
        // เมื่อ setIdgames เสร็จสิ้นแล้ว ให้ดึงข้อมูลเกม
        if (idgames.length > 0) {
          const gamesPromises = idgames.map(async (id) => {
            const Mygame = doc(db, 'Games', id);
            const ThisMygame = await getDoc(Mygame);
            return { id: ThisMygame.id, ...ThisMygame.data() };
          });

          const games = await Promise.all(gamesPromises);
          setCgames(games);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [cuser, idgames]);

  const checkLogin = async () => {
    try {
      const user = await new Promise((resolve, reject) => {
        onAuthStateChanged(auth, resolve, reject);
      });

      if (user) {
        setCuser(user.uid);
      }
    } catch (error) {
      console.error('Error checking login:', error);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []); // ตั้งค่าให้ useEffect นี้ทำงานเพียงครั้งเดียวที่ตอนแรกเท่านั้น

  if (isLoading) {
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
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.container2}>
        {cgames.map((item, index) => (
          <TouchableOpacity  key={item.id} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ ...styles.imageContainer, marginTop: 10, marginLeft: 5 }} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
                <Image source={{ uri: item.Pic }} style={styles.image} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'column', margin: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 14, color: '#fff', marginBottom: 15, fontWeight: 'bold',width:'90%' }}  numberOfLines={2} >{item.Name}</Text>
                <Text style={{ fontSize: 14, color: '#fff' }}>Tag: {item.Tag}</Text>
              </View>
            </View>
          </TouchableOpacity>

        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Head: {
    backgroundColor: '#2F2E34',
  },
  Head2: {
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  Body: {
    backgroundColor: '#2F2E34',
    height: '100%',
  },
  Inteboby: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 5
  },
  imageContainer: {
    width: 150,
    height: 150,
  },
  containerview: {
    flex: 1,
    backgroundColor: '#2F2E34',
  },
});