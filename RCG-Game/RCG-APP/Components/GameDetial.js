import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Linking, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from "../Firestore"; // ระบุตำแหน่งของ Firebase.js ที่คุณบันทึกไว้
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, arrayRemove, increment } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '@firebase/auth';

export default function GameDetail({ route, navigation }) {
  const { gameId } = route.params;
  const [gameDetail, setGameDetail] = useState(null);
  const [content, setcontent] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cuser, setCuser] = useState(null);
  const [comments, setComments] = useState([]);
  const auth = getAuth();



  /*-------------------------------------------------------------------------------------*/

  const fetchGameDetail = async () => {
    try {
      const gameDocRef = doc(db, 'Games', gameId);
      const docSnap = await getDoc(gameDocRef);

      if (docSnap.exists()) {
        const gameData = docSnap.data();
        setGameDetail(gameData);

        const commentsWithUserData = await Promise.all(
          (gameData.comments || []).map(async (comment) => {
            try {
              const userDocRef = doc(db, 'users', comment.userId);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                return {
                  content: comment.content,
                  userId: comment.userId,
                  userName: userData.username,
                  picPF: userData.picPF,
                };
              } else {
                return null;
              }
            } catch (error) {
              console.error('Error fetching user details:', error);
              return null;
            }
          })
        );

        const validComments = commentsWithUserData.filter((comment) => comment !== null);
        setComments(validComments);
      } else {
        console.log('No such document!');
      }

      const Mygame = doc(db, 'users', cuser);
      try {
        const userDocSnap = await getDoc(Mygame);
        const userData = userDocSnap.data();
        if (userData && userData.Mygames !== null) {
          const isGameInMyGames = userData.Mygames.some((game) => game.MyGameID === gameId);
          setIsActive(isGameInMyGames);
        } else {
          console.error('Mygames is null or userData is null');
        }
      } catch (error) {
        console.error('Error fetching Mygames:', error);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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
    const fetchData = async () => {
      await checkLogin(); // รอให้ checkLogin เสร็จก่อนที่จะไป fetchGameDetail
      await fetchGameDetail(); // รอให้ fetchGameDetail เสร็จก่อนที่จะปิดสถานะ loading
      setLoading(false);
    };

    fetchData();
  }, [gameId, cuser]); // เพิ่ม cuser เป็น dependency ใน useEffect
  /*-------------------------------------------------------------------------------------*/

  if (loading) {
    // แสดงข้อความ "Loading..."
    return (
      <View style={{ backgroundColor: '#282727', flex: 1, alignContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ marginTop: 250 }} size={70} color="#ffffff" />
        <Text style={{ marginTop: 5, fontSize: 30, color: '#fff', ...styles.shadow }}>LOADING...</Text>
      </View>
    );
  }

  if (!gameDetail) {
    return (
      <View>
        <Text>No data found.</Text>
      </View>
    );
  }
  /*-------------------------------------------------------------------------------------*/

  const addComment = async () => {
    try {
      if (!content) {
        alert('กรุณาใส่ความคิดเห็น');
        return;
      }
      const gameRef = doc(db, 'Games', gameId);
      await updateDoc(gameRef, {
        comments: arrayUnion({
          userId: cuser,
          content: content,
        }),
      });
      setcontent('');
      alert('ขอบคุณที่แสดงความคิดเห็น');
      fetchGameDetail();
      // รีเซ็ตค่า content เป็น string ว่างหลังจากที่คอมเม้นถูกเพิ่ม
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  /*-------------------------------------------------------------------------------------*/
  const handleInputChange = (text) => {
    setcontent(text);
  };
  /*---------------------------------------------------------------------------------------*/

  const handlePress = async () => {
    try {
      const Mygame = doc(db, 'users', cuser);

      // ตรวจสอบว่า MyGameID มีอยู่ใน Mygames หรือไม่
      const isGameInMyGames = (await getDoc(Mygame)).data().Mygames.some((game) => game.MyGameID === gameId);

      if (isGameInMyGames) {
        // ถ้ามีอยู่แล้ว ให้ลบ MyGameID ออก
        await updateDoc(Mygame, {
          Mygames: arrayRemove({
            MyGameID: gameId,
          }),
        });

        // ลดค่า Rate ของเกม, ตรวจสอบว่าไม่ลดลงต่ำกว่า 0
        const gameRef = doc(db, 'Games', gameId);
        await updateDoc(gameRef, {
          Rate: increment(-1),
        });
      } else {
        // ถ้ายังไม่มีให้เพิ่ม MyGameID เข้าไป
        await updateDoc(Mygame, {
          Mygames: arrayUnion({
            MyGameID: gameId,
          }),
        });

        // เพิ่มค่า Rate ของเกม
        const gameRef = doc(db, 'Games', gameId);
        await updateDoc(gameRef, {
          Rate: increment(1),
        });
      }

      // ตั้งค่า isActive ตามผลลัพธ์ที่ได้
      setIsActive(!isGameInMyGames);
    } catch (error) {
      console.error(error);
    }
    fetchGameDetail();
  };

  /*------------------------------------------------------------------------------------*/
  const removecomments = async (index, userId) => {
    // เช็คว่า cuser ตรงกับ userId หรือไม่
    if (cuser !== userId) {
      alert('คุณไม่มีสิทธ์ในการลบความคิดเห็นนี้!!');
      return;
    }

    // แสดง alert เพื่อยืนยันการลบคอมเมนต์
    Alert.alert(
      'ยืนยันการลบคอมเมนต์',
      'คุณแน่ใจหรือไม่ที่ต้องการลบคอมเมนต์นี้?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ลบ',
          onPress: () => {
            // ดำเนินการลบคอมเมนต์จาก state
            const updatedComments = [...comments];
            updatedComments.splice(index, 1);
            setComments(updatedComments);

            // ดำเนินการลบคอมเมนต์จาก Firestore
            try {
              const gameDocRef = doc(db, 'Games', gameId);
              updateDoc(gameDocRef, {
                comments: updatedComments.map((comment) => ({ userId: comment.userId, content: comment.content })),
              });
            } catch (error) {
              console.error('Error removing comment from Firestore:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  /*------------------------------------------------------------------------------------*/

  return (
    <ScrollView style={styles.containerview}>
      <View style={styles.bodyA}>
        {gameDetail && (
          <View key={gameDetail.id} style={styles.GameInfo}>
            <View>
              <Image source={{ uri: gameDetail.Pic }} style={{ ...styles.image }} />
            </View>
            <View style={styles.Gameinfo2}>
              <Text style={{ ...styles.shadow, fontWeight: 'bold', color: '#FFFF', fontSize: 16 }}
                numberOfLines={2} ellipsizeMode="tail">{gameDetail.Name} </Text>
              <Text style={{ ...styles.shadow, fontWeight: 'bold', color: '#FFFF', fontSize: 12, marginTop: 10 }}>
                Rate : {gameDetail.Rate}
              </Text>
              <Text style={{ ...styles.shadow, fontWeight: 'bold', color: 'grey', fontSize: 12, marginTop: 10 }}>
                Tag : {gameDetail.Tag}
              </Text>
              <TouchableOpacity onPress={handlePress} style={{ marginTop: 10 }}>
                <MaterialCommunityIcons name="cards-heart" color={isActive ? '#620F0F' : 'white'} size={40} style={{ ...styles.shadow }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View>
        <ScrollView
          style={{ marginTop: 20, overflowY: 'auto' }}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {gameDetail && gameDetail.Gameshow && gameDetail.Gameshow.map((imageUrl, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.imageshow} />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.containerB}>
        {gameDetail && (
          <View key={gameDetail.id}>
            <Text style={{ ...styles.shadow, fontSize: 20, color: '#C9C212', marginLeft: 20 }}>Detail</Text>
            <Text style={{ fontSize: 15, color: '#C9C212', marginLeft: 30 }}>{gameDetail.About}</Text>
            <Text style={{ ...styles.shadow, fontSize: 20, color: '#C9C212', marginLeft: 20, marginTop: 20 }}>Support and DownLoad</Text>
            {gameDetail.Linkdl ? (
              <TouchableOpacity onPress={() => Linking.openURL(gameDetail.Linkdl)}>
                <Text style={{ fontSize: 15, color: '#C9C212', marginLeft: 30, marginTop: 5 }}>{gameDetail.Linkdl}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontSize: 15, color: '#C9C212', marginLeft: 30, marginTop: 5 }}>Not Available</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.containerC}>
        <Text style={{ fontSize: 20, color: '#C9C212', margin: 8, ...styles.shadow }}>คุณคิดเห็นอย่างไรบ้าง? </Text>
        <View style={styles.commentbox}>
          <TextInput
            style={{ borderColor: 'gray', borderWidth: 1, color: '#C9C212', fontSize: 15, borderRadius: 5 }}
            multiline={true}
            numberOfLines={4}
            onChangeText={handleInputChange}
            value={content}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'lightblue',
            width: 60,
            height: 25,
            borderRadius: 3,
            marginLeft: 310,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: 'gray',
          }}
          onPress={addComment}
        >
          <Text style={{ color: 'white' }}>{'Submit'}</Text>
        </TouchableOpacity>
        <View style={styles.commentarea}>
          <Text style={{ fontSize: 20, color: '#C9C212', margin: 8, ...styles.shadow }}>พื้นที่พูดคุย</Text>
          <View >
            {comments.map((comment, index) => (
              <View key={index} style={styles.commentshow}>
                <View style={{ backgroundColor: '#44443b', height: 30, marginBottom: 5, borderRadius: 5, flexDirection: 'row',  }}>
                  <Image
                    style={{width:25,height:25,borderRadius:15,marginLeft:2,marginTop:2}}
                    source={{
                      uri: comment.picPF ? comment.picPF : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                    }}
                  />  
                  <Text style={{ ...styles.font2,marginTop:5 }}>{`${comment.userName}`}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => removecomments(index, comment.userId)} style={{ marginTop: 0, }}>
                    <MaterialCommunityIcons name="trash-can" color={'#C9C212'} size={20} style={{ ...styles.shadow, marginRight: 5, marginTop: 2 }} />
                  </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ ...styles.font2, marginBottom: 5 }}>{` ${comment.content}`}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  bodyA: {
    height: '100%',
    flex: 1,
    justifyContent: 'Left',
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
  },
  containerB: {
    width: '95%',
    height: '150',
    marginBottom: 50,
    marginTop: 20,
    flexGrow: 1,
  },
  containerC: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#232323',
    flexGrow: 1,
  },
  commentarea: {
    margin: 7,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#232323',
    flexGrow: 1,
  },
  commentshow: {
    margin: 7,
    borderRadius: 5,
    flex: 1,
    borderWidth: 1,
    backgroundColor: '#232323',
    flexGrow: 1,
    width: '95%',
  },
  commentbox: {
    margin: 7,
    borderRadius: 5,
    width: '95%',
    flex: 1,
    borderWidth: 1,
    backgroundColor: '#232323',
    flexGrow: 1,
  },
  containerview: {
    flex: 1,
    backgroundColor: '#232323',
  },
  GameInfo: {
    justifyContent: 'left',
    flexDirection: 'row',
  },
  Gameinfo2: {
    width: 130,
    marginLeft: 20,
    justifyContent: 'Center',
    flexDirection: 'column',
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  image: {
    flex: 1,
    width: 170,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10, // ปรับขนาดความโค้งของมุม
  }, imageContainer: {
    width: 300,
    height: 200,
    marginHorizontal: 2, // ระยะห่างระหว่างรูปภาพ
  },
  imageshow: {
    flex: 1,
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10, // ปรับขนาดความโค้งของมุม
  },
  font2: {
    fontSize: 15,
    color: '#C9C212',
    marginLeft: 5,
    // เพิ่มสไตล์ textShadow 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
