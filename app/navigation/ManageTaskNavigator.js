import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageTasksScreen from '../screens/ManageTasksScreen';
import ManageTaskScreen from '../screens/ManageTaskScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';


const ManageTaskScreenStack = createStackNavigator();

export default function ManageTasksScreens() {
    return (
        <ManageTaskScreenStack.Navigator>
            <ManageTaskScreenStack.Screen name="ManageTasksScreen" component={ManageTasksScreen} options={{
                headerShown: false,
            }}/>

            <ManageTaskScreenStack.Screen name="ManageTaskScreen" component={ManageTaskScreen} options={{
                title: "Manage Chore Schedules",
                cardStyle: {
                    backgroundColor: "white"
                }
            }}/>

        <ManageTaskScreenStack.Screen name="CreateTaskScreen" component={CreateTaskScreen} options={{
                title: "Create Task",
                cardStyle: {
                    backgroundColor: "white"
                },
                headerStyle: {
                    backgroundColor: "white"
                }
            }}/>
       </ManageTaskScreenStack.Navigator>
    );
  }

