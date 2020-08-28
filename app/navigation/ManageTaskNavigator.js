import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageTasksScreen from '../screens/ManageTasksScreen';
import ManageTaskScreen from '../screens/ManageTaskScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import { Button } from 'react-native';


const ManageTaskScreenStack = createStackNavigator();

export default function ManageTasksScreens({navigation}) {

    return (
        <ManageTaskScreenStack.Navigator>
            <ManageTaskScreenStack.Screen name="ManageTasksScreen" component={ManageTasksScreen} options={{
                headerShown: false,
            }}/>

            <ManageTaskScreenStack.Screen name="ManageTaskScreen" component={ManageTaskScreen} options={{
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
                //         navigation.navigate('CreateTaskScreen')
                //       }}
                //       title="Edit"
                //     />
                //   ),
                
            }}/>

        <ManageTaskScreenStack.Screen name="CreateTaskScreen" component={CreateTaskScreen} options={{
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

