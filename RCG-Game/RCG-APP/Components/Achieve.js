import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Text, View, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Animated, ActivityIndicator, Button } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, Alert } from '@firebase/firestore';
import { db } from "../Firestore";
import { Accelerometer } from 'expo-sensors';

export default function Achieve({ navigation }) {
  const [gamesData, setGamesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('0');
  const [filteredGames, setFilteredGames] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [randomview, setRandomView] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [randomgameid, setrandomgameid] = useState('');
  const [randomgamename, setrandomgamename] = useState('');
  const [randomgamepic, setrandomgamePic] = useState('');




  useEffect(() => {
    const subscription1 = Accelerometer.addListener((data) => {
      const { x, y, z } = data;
      setAccelerometerData({ x, y, z });
    });

    return () => subscription1.remove();
  }, []);


  useEffect(() => {
    async function fetchGames() {
      const gamesDataWithID = [];
      const gamesCollection = collection(db, 'Games');
      const querySnapshot = await getDocs(gamesCollection);

      querySnapshot.forEach((doc) => {
        const gameData = doc.data();
        const gameID = doc.id;

        gamesDataWithID.push({ id: gameID, ...gameData });
      });

      setGamesData(gamesDataWithID);
      setFilteredGames(gamesDataWithID);
    }

    fetchGames();
  }, []);

  useEffect(() => {
    // Call handleSearch when selectedTag or searchQuery changes
    handleSearch(searchQuery);
  }, [selectedTag, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter games based on the search query and selected tag
    const filtered = gamesData.filter((game) => {
      const tagMatch = selectedTag === '0' || game.Tag === selectedTag; // Match 'ALL' or the selected tag
      const nameMatch = !query || game.Name.toLowerCase().includes(query.toLowerCase());
      return tagMatch && nameMatch;
    });

    setFilteredGames(filtered);
  };

  //-----------------------------------------------------------------------------------------------------------//

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);

    const shakeDuration = 4000;

    // รอ 4 วินาทีก่อนที่จะเก็บค่า subscription
    setTimeout(() => {
      const subscription = Accelerometer.addListener((data) => {
        const { x, y, z } = data;
        if (x !== accelerometerData.x || z !== accelerometerData.z) {
          setIsShaking(false);
          const randomIndex = Math.floor(Math.random() * filteredGames.length);
          const randomGame = filteredGames[randomIndex];
          //console.log(`ID: ${randomGame.id}  ${randomGame.Name}`);
          setrandomgameid(randomGame.id);
          setrandomgamename(randomGame.Name);
          setrandomgamePic(randomGame.Pic);
          setRandomView(true);
        }
        //console.log({ x }, { z });
        //console.log(accelerometerData.x, accelerometerData.z);
        subscription.remove(); // ยกเลิกการตรวจจับ 
        setIsShaking(false);
      });
    }, shakeDuration);
  };

  const shakephone = 'https://cdn.dribbble.com/users/62525/screenshots/6037907/hand_shake.gif';

  if (isShaking) {
    return (
      <View style={{ backgroundColor: '#282727', flex: 1, alignContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: shakephone }} style={[styles.image]} />
        <Text style={{ position: 'absolute' ,marginTop: 50, fontSize: 30, color: '#fff', ...styles.shadow }}>เขย่าหน้าจอมือถือเพื่อสุ่มเกม</Text>
      </View>
    );
  }

  if (randomview) {
    return (
      <View style={{ flex: 1, width: 'auto', height: 'auto', alignContent: 'center', alignItems: 'center', backgroundColor: 'rgba(38, 38, 38,1.00)' }}>
        <Text style={{ marginTop: 5, fontSize: 30, color: '#fff', ...styles.shadow }}>คุณเคยเล่นเกมนี้แล้วหรือยัง?</Text>
        <View style={{width:300,height:300,marginTop:10}}>
          <Image
            source={{ uri: randomgamepic }}
            style={styles.image}
          />
        </View>
        <Text style={{ marginTop: 5, fontSize: 30, color: '#fff', ...styles.shadow }} numberOfLines={2} ellipsizeMode="tail">{randomgamename}</Text>
        <View style={{ marginTop: 10,width:100 }}>
          <Button title="Detail" onPress={() => navigation.navigate('GameDetail', { gameId: randomgameid })} color="#3C8A8F" />
        </View>
        <View style={{ marginTop: 10 ,width:100}}>
          <Button title="Cancel" onPress={() => setRandomView(false)} color="#3C8A8F" />
        </View>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.nav1}>
        <TextInput
          style={styles.textInput}
          placeholder="ค้นหาชื่อเกมที่นี้"
          placeholderTextColor="#8E8C8C"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.nav2}>
        <Text style={{ fontSize: 16, color: '#fff', marginLeft: 40 }}>เลือกหมวดหมู่ : </Text>
        <View style={{ ...styles.containPicker, borderWidth: 1, borderRadius: 5 }}>
          <Picker
            selectedValue={selectedTag}
            onValueChange={(itemValue) => {
              setSelectedTag(itemValue);
              handleSearch(searchQuery); // Trigger the search filter when the tag is changed
            }}
          >
            <Picker.Item label="ALL" value='0' />
            <Picker.Item label="Survival" value="Survival" />
            <Picker.Item label="Horror" value="Horror" />
            <Picker.Item label="Story" value="Story" />
            <Picker.Item label="Adventure" value="Adventure" />
            <Picker.Item label="Action" value="Action" />
          </Picker>
        </View>
        <TouchableOpacity onPress={handleShake}>
          <Image style={{ marginLeft: 10, marginTop: -5 }} source={require('../assets/Component1.png')} />
        </TouchableOpacity>
      </View>

      <View style={styles.container2}>
        {filteredGames.map((game, index) => (
          <TouchableOpacity
            key={index}
            style={{ ...styles.imageContainer, marginTop: 10, marginLeft: 20 }}
            onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
          >
            <Image
              source={{ uri: game.Pic }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F2E34',
    height: '100%'
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  nav1: {
    flexDirection: 'row',
    backgroundColor: '#2F2E34'
  },
  nav2: {
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    height: 40,
    margin: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#D9D9D9'
  },
  containPicker: {
    marginTop: -10,
    width: 130,
    height: 40,
    backgroundColor: '#D9D9D9',
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginHorizontal: 5,
  },
});
