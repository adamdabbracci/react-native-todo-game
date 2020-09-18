import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { Button } from 'react-native-elements';
import AccountScreen from '../screens/AccountScreen';
import ManageTasksScreens from './ManageTaskNavigator';
import CoinStoreScreen from '../screens/CoinStoreScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'HomeScreen';

export default function BottomTabNavigator({ navigation, route }) {


  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{
    }} screenOptions={{
}}>

      
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title:"My Chores",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />

<BottomTab.Screen
        name="ManageTasksScreens"
        component={ManageTasksScreens}
        options={{
          title: 'Manage',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-apps" />,
        }}
      />

      <BottomTab.Screen
        name="CoinStoreScreen"
        component={CoinStoreScreen}
        options={{
          title: 'Coin Store',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} fam name="md-apps" />,
        }}
      />

      {/* <BottomTab.Screen
        name="ProgresScreen"
        component={ProgressScreen}
        options={{
          title: 'Challenges',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      /> */}
      
      <BottomTab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-log-in" />,
        }}

        
      />
    </BottomTab.Navigator>
  );
}
