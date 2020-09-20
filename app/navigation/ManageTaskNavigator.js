import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageSchedulesScreen from '../screens/ManageSchedulesScreen';
import ScheduleDetailsScreen from '../screens/ScheduleDetailsScreen';
import EditScheduleScreen from '../screens/EditScheduleScreen';
import { Button } from 'react-native';


const ManageTaskScreenStack = createStackNavigator();
export default function ManageTasksScreens({navigation}) {

    return (
        <ManageTaskScreenStack.Navigator>
            <ManageTaskScreenStack.Screen name="ManageSchedulesScreen" component={ManageSchedulesScreen} options={{
                headerShown: false,

            }}/>

            <ManageTaskScreenStack.Screen name="ScheduleDetailsScreen" component={ScheduleDetailsScreen} options={{
                title: "Manage Schedule",
                cardStyle: {
                    backgroundColor: "white"
                },
                headerStyle: {
                    backgroundColor: "white"
                },
                // headerRight: () => (
                //     <Button
                //       onPress={() => {
                //         navigation.navigate('EditScheduleScreen')
                //       }}
                //       title="Edit"
                //     />
                //   ),
                
            }}/>

        <ManageTaskScreenStack.Screen name="EditScheduleScreen" component={EditScheduleScreen} options={{
                cardStyle: {
                    backgroundColor: "white"
                },
                headerStyle: {
                    backgroundColor: "white"
                },
                title: "Edit Schedule"
            }}/>
       </ManageTaskScreenStack.Navigator>
    );
  }

