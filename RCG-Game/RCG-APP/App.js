import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Dimensions, ScrollView } from 'react-native';
import Home from './Components/Home';
import Achieve from './Components/Achieve';
import MyGame from './Components/MyGame';
import Profile from './Components/Profile';
import Register from './Components/Register';
import Login from './Components/Login';
import Forgot from './Components/Forgot';
import { Header, Footer } from './Components/HeaderFooter';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GameDetial from './Components/GameDetial';
import Setting from './Components/Setting';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//ส่วนการทำงาน
export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }} />
        <Stack.Screen name="Hometab" component={Hometab} options={{ headerShown: false }} />
        <Stack.Screen name="Setting" component={ Setting} options={{ headerShown: false }} />
        <Stack.Screen name="GameDetail" component={GameDetial} options={({route}) => ({
          headerTintColor: 'white',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./pic/RCG.png')} style={styles.picheader} />
              <Text style={styles.headerDetial}>RECOMMEND GAMES</Text>
            </View>
          ),
          headerShown: route.params?.headerShown || true,
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.Myheader2,
           })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="Forgot" component={Forgot} options={{headerShown:false}} />
    </Stack.Navigator>
  );
}

function Hometab() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor: '#444444',
        activeTintColor: '#e91e63',
      },
    }}>
      <Tab.Screen
        name="Home" component={Home} options={({ route }) => ({
          title: "RECOMMANDGAMES",
          headerLeft: () => (
            <Image source={require('./pic/RCG.png')} style={styles.picheader} />
          ),
          headerShown: route.params?.headerShown || true,
          tabBarLabel: 'Home',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.Myheader,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />  // home คือภาพจาก Mater
          ),
        })}
      />
      <Tab.Screen name="Achieve" component={Achieve} options={({ route }) => ({
        title: "GAME ARCHIVE",
        headerLeft: () => (
          <Image source={require('./pic/RCG.png')} style={styles.picheader} />
        ),
        headerShown: route.params?.headerShown || true,
        tabBarLabel: 'Achieve',
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.Myheader,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="gamepad-variant-outline" color={color} size={size} />
        ),
      })} />
      <Tab.Screen name="MyGame" component={MyGame} options={({ route }) => ({
        title: "MY GAMES",
        headerLeft: () => (
          <Image source={require('./pic/RCG.png')} style={styles.picheader} />
        ),
        headerShown: route.params?.headerShown || true,
        tabBarLabel: 'Mygame',
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.Myheader,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="heart-outline" color={color} size={size} />
        ),
      })} />
      <Tab.Screen name="Profile" component={Profile} options={({ route }) => ({
        title: "USER PROFILE",
        headerLeft: () => (
          <Image source={require('./pic/RCG.png')} style={styles.picheader} />
        ),
        headerShown: route.params?.headerShown || true,
        tabBarLabel: 'Profile',
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.Myheader,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      })} />
    </Tab.Navigator>
  );
}








//ส่วนของ สไตร์
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2E34',
  },
  contentContainer: {
    flex: 1,
  },
  Myheader: {
    backgroundColor: "#444444",
    elevation: 5, // สำหรับ Android
    shadowColor: 'rgba(0, 0, 0, 0.25)', // สำหรับ iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 15,
    shadowRadius: 4,
  },
  Myheader2: {
    backgroundColor: "#282727",
    elevation: 5, // สำหรับ Android
    shadowColor: 'rgba(0, 0, 0, 0.25)', // สำหรับ iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 15,
    shadowRadius: 4,
  },
  picheader: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // ทำให้ตัวอักษรหนา
    marginLeft: -10, // ปรับตำแหน่งตามความต้องการ
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },headerDetial: {
    color: '#fff',
    fontSize: 18, 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
